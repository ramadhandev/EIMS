import { DocumentRequirement } from "@/types/document";
import { CreateDocumentRequirement, UpdateDocumentRequirement } from "@/types/document-requirement";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const documentRequirementApi = {
  // Get all document requirements
  getAll: async (): Promise<DocumentRequirement[]> => {
    const response = await fetch(`${API_URL}/documentrq`);
    if (!response.ok) throw new Error('Failed to fetch document requirements');
    return response.json();
  },

  // Get by ID
  getById: async (id: number): Promise<DocumentRequirement> => {
    const response = await fetch(`${API_URL}/documentrq/${id}`);
    if (!response.ok) throw new Error('Failed to fetch document requirement');
    return response.json();
  },

  // Create new
  create: async (data: CreateDocumentRequirement): Promise<DocumentRequirement> => {
    const response = await fetch(`${API_URL}/documentrq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create document requirement');
    return response.json();
  },

  // Update
  update: async (id: number, data: UpdateDocumentRequirement): Promise<DocumentRequirement | null> => {
  const response = await fetch(`${API_URL}/documentrq/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to update document requirement');

  // Jika status 204 No Content, kembalikan null
  if (response.status === 204) return null;

  // Cek apakah body ada
  const text = await response.text();
  return text ? JSON.parse(text) : null;
},


  // Delete
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/documentrq/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete document requirement');
  }
};