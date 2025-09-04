export interface User {
  UserId: number
  name: string
  role: string
  department: string
}

export interface UserDocument {
 userDocumentId: number
  documentName: string
  documentRequirementId: number
  documentRequirementName: string
  userId: number
  userName: string
  fileURL: string
  uploadDate: string
  status: string
}


export interface DocumentRequirement {
  documentRequirementId: number
  name: string
  description: string | null
}