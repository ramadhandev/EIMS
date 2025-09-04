'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import DocumentTable from "./components/DocumentTable"
import DocumentForm from "./components/DocumentForm"
import { UserDocument, DocumentRequirement } from "@/types/document"
import { documentApi } from '@/lib/api/document'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
    fetchDocumentRequirements()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await documentApi.getUserDocuments()
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDocumentRequirements = async () => {
    try {
      const response = await documentApi.getDocumentRequirements()
      if (response.ok) {
        const data = await response.json()
        setDocumentRequirements(data)
      }
    } catch (error) {
      console.error('Error fetching document requirements:', error)
    }
  }

  const handleEdit = (document: UserDocument) => {
    setSelectedDocument(document)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedDocument(null)
    fetchDocuments()
  }

  const filteredDocuments = documents.filter(document => 
    (document.documentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="types">Document Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>
                Manage and review all documents in the system
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading documents...</div>
              ) : (
                <DocumentTable 
                  documents={filteredDocuments} 
                  documentRequirements={documentRequirements}
                  onEdit={handleEdit}
                  onDelete={fetchDocuments}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Document Requirements</CardTitle>
              <CardDescription>
                Manage document requirements and types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Document requirements define the types of documents users need to submit.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/documents/types'}>
                Manage Document Requirements
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DocumentForm 
        open={isFormOpen} 
        onClose={handleFormClose} 
        document={selectedDocument}
        documentRequirements={documentRequirements}
         onSuccess={fetchDocuments} 
      />
    </div>
  )
}