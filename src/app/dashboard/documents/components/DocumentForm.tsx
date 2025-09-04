'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserDocument, DocumentRequirement } from "@/types/document"
import { documentApi } from '@/lib/api/document'

interface DocumentFormProps {
  open: boolean
  onClose: () => void
  document?: UserDocument | null
  documentRequirements: DocumentRequirement[]
  onSuccess: () => void
}

export default function DocumentForm({ 
  open, 
  onClose, 
  document, 
  documentRequirements, 
  onSuccess 
}: DocumentFormProps) {
  
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    userId: '',
    documentRequirementId: '',
    fileURL: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (open) {
      fetchUsers()
      if (document) {
        setFormData({
          userId: document.userId?.toString() || '',
          documentRequirementId: document.documentRequirementId?.toString() || '',
          fileURL: document.fileURL || ''
        })
      } else {
        setFormData({
          userId: '',
          documentRequirementId: '',
          fileURL: ''
        })
      }
      setFile(null)
      setError('')
    }
  }, [open, document])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error('Failed to fetch users:', response.status)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validasi
    if (!formData.userId || !formData.documentRequirementId) {
      setError('Please select both user and document requirement')
      setLoading(false)
      return
    }

    if (!document && !file && !formData.fileURL) {
      setError('Please select a file or provide a file URL')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('userId', formData.userId)
      formDataToSend.append('documentRequirementId', formData.documentRequirementId)
      
      // Jika ada file, append file
      if (file) {
        formDataToSend.append('file', file)
      } else if (formData.fileURL && !document) {
        // Untuk create baru dengan URL
        formDataToSend.append('fileURL', formData.fileURL)
      }

      let url: string
      let method: string

      if (document) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/userdocument/${document.userDocumentId}`
        method = 'PUT'
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/userdocument`
        method = 'POST'
      }

      console.log('Sending request to:', url)
      console.log('Method:', method)
      console.log('Form data keys:')
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value)
      }

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      // Coba baca response text terlebih dahulu
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      if (response.ok) {
        console.log('Document saved successfully')
        onSuccess()
        onClose()
      } else {
        let errorMessage = `Failed to save document (Status: ${response.status})`
        
        // Coba parse sebagai JSON jika mungkin
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          try {
           const errorData = JSON.parse(responseText)
if (Object.keys(errorData).length > 0) {
  errorMessage = errorData.message || errorData.title || errorData.detail || errorMessage
  console.error('Error details:', errorData)
} else {
  console.error('Error: empty response object')
}

          } catch (parseError) {
            console.error('Failed to parse error response:', parseError)
            errorMessage = responseText || errorMessage
          }
        } else if (responseText) {
          errorMessage = responseText
        }

        setError(errorMessage)
        console.error('Failed to save document:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Network error saving document:', error)
      setError(`Network error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError('')

    if (selectedFile) {
      // Validasi ukuran file (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        e.target.value = '' // Reset input file
        return
      }

      // Validasi tipe file
      const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif']
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Only PDF, JPEG, PNG, and GIF files are allowed')
        e.target.value = '' // Reset input file
        return
      }

      setFile(selectedFile)
      // Reset fileURL karena kita menggunakan file baru
      setFormData(prev => ({ ...prev, fileURL: '' }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      fileURL: e.target.value
    }))
    // Reset file jika user mulai mengetik URL
    if (file) {
      setFile(null)
      const fileInput = window.document.getElementById('file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose()
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? 'Edit Document' : 'Add New Document'}
          </DialogTitle>
          <DialogDescription>
            {document ? 'Update the document details' : 'Add a new document to the system'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">User *</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => setFormData({ ...formData, userId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.length > 0 ? (
                  users
                    .filter((user) => user.userId != null)
                    .map((user) => (
                      <SelectItem key={user.userId} value={String(user.userId)}>
                        {user.name} ({user.department})
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="loading" disabled>
                    Loading users...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentRequirement">Document Requirement *</Label>
            <Select
              value={formData.documentRequirementId}
              onValueChange={(value) => setFormData({ ...formData, documentRequirementId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a document requirement" />
              </SelectTrigger>
              <SelectContent>
                {documentRequirements
                  .filter((req) => req.documentRequirementId != null)
                  .map((req) => (
                    <SelectItem key={req.documentRequirementId} value={String(req.documentRequirementId)}>
                      {req.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">
              {document ? 'Update File (optional)' : 'File Upload *'}
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPG, PNG, GIF (Max 10MB)
            </p>
            
            {file && (
              <div className="text-sm text-green-600 p-2 bg-green-50 rounded-md">
                <strong>✅ File selected:</strong> {file.name} 
                <br />
                <span className="text-xs">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
            
            {formData.fileURL && !file && (
              <div className="text-sm text-muted-foreground p-2 bg-blue-50 rounded-md">
                <strong>📄 Current file URL:</strong>{' '}
                <a 
                  href={formData.fileURL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline break-all"
                >
                  {formData.fileURL.length > 50 ? formData.fileURL.substring(0, 50) + '...' : formData.fileURL}
                </a>
              </div>
            )}
          </div>

         
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </span>
              ) : (
                document ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}