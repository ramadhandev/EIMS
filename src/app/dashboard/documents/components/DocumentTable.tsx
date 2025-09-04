'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Download } from "lucide-react"
import { UserDocument, DocumentRequirement } from "@/types/document"
import { Badge } from "@/components/ui/badge"
import { documentApi } from "@/lib/api/document"

interface DocumentTableProps {
  documents: UserDocument[]
  documentRequirements: DocumentRequirement[]
  onEdit: (document: UserDocument) => void
  onDelete: () => void
}

export default function DocumentTable({ documents, documentRequirements, onEdit, onDelete }: DocumentTableProps) {
  const getDocumentRequirementName = (id: number) => {
    const requirement = documentRequirements.find(r => r.documentRequirementId === id)
    return requirement ? requirement.name : 'Unknown'
  }

  const handleDownload = async (id: number, name: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/userdocument/download/${id}`
    );

    if (!response.ok) throw new Error('Failed to download');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = name; // bisa pakai documentName atau DocumentRequirement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download file');
  }
};



  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await documentApi.deleteUserDocument(id)
        if (response.ok) {
          onDelete()
        } else {
          console.error('Failed to delete document')
        }
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    }
  }

  if (documents.length === 0) {
    return <div className="text-center py-4">No documents found</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {document.documentName || getDocumentRequirementName(document.documentRequirementId)}
            </TableCell>
            <TableCell>
              {getDocumentRequirementName(document.documentRequirementId)}
            </TableCell>
            <TableCell>{document.userName || 'Unknown'}</TableCell>
            <TableCell>
              {new Date(document.uploadDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge variant="outline">Uploaded</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {document.fileURL && (
                  <Button
                    variant="outline"
                    size="icon"
                       onClick={() => handleDownload(document.userDocumentId, document.documentName || 'document.pdf')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(document)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(document.userDocumentId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}