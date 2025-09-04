const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const documentApi = {
  // User Document endpoints
  getUserDocuments: () => fetch(`${API_BASE_URL}/UserDocument`),
  getUserDocument: (id: number) => fetch(`${API_BASE_URL}/UserDocument/${id}`),
  createUserDocument: (data: any) => 
    fetch(`${API_BASE_URL}/UserDocument`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateUserDocument: (id: number, data: any) => 
    fetch(`${API_BASE_URL}/UserDocument/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteUserDocument: (id: number) => 
    fetch(`${API_BASE_URL}/UserDocument/${id}`, {
      method: 'DELETE'
    }),

  // Document Requirement endpoints
  getDocumentRequirements: () => fetch(`${API_BASE_URL}/DocumentRq`),
  getDocumentRequirement: (id: number) => fetch(`${API_BASE_URL}/DocumentRq/${id}`),
  createDocumentRequirement: (data: any) => 
    fetch(`${API_BASE_URL}/DocumentRq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateDocumentRequirement: (id: number, data: any) => 
    fetch(`${API_BASE_URL}/DocumentRq/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteDocumentRequirement: (id: number) => 
    fetch(`${API_BASE_URL}/DocumentRq/${id}`, {
      method: 'DELETE'
    }),
};