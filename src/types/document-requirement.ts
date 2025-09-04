
export interface DocumentRequirement {
  documentRequirementId: number;
  name: string;
  description: string | null;
}

export interface CreateDocumentRequirement {
  name: string;
  description?: string;
}

export interface UpdateDocumentRequirement {
  name: string;
  description?: string;
}