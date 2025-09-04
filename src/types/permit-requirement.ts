
export interface PermitRequirement {
  requirementId: number;
  workType: string;
  requiredCardTypeId: number;
  requiredCardTypeName: string;
  requiredTraining?: string;
  notes?: string;
}

export interface CreatePermitRequirement {
  workType: string;
  requiredCardTypeId: number;
  requiredTraining?: string;
  notes?: string;
}

export interface UpdatePermitRequirement {
  workType?: string;
  requiredCardTypeId?: number;
  requiredTraining?: string;
  notes?: string;
}