import { Approval } from "./approval";

// src/types/supervisor.ts
export interface PermitDetail {
 permitId: number;
  userId: number;
  userName: string;   // <--- tambahin ini
  workType: string;
  location?: string;
  startDate: string;  // biasanya dikirim JSON dalam format ISO string
  endDate: string;
  requiredCardTypeId?: number;
  requiredCardTypeName?: string;
  status: string;
  autoApproved: boolean;
  autoApprovedDate?: string;
  autoApprovedBy?: number;
  autoApprovedByName?: string;
  createdAt: string;
  notes?: string;
  approvals: Approval[];
}


// Data yang dikirim saat CREATE permit
export interface PermitCreate {
  userId: number;
  workType: string;
  location?: string;
  startDate: string;
  endDate: string;
  requiredCardTypeId: number;
  notes?: string;
}

// Data yang dikirim saat UPDATE permit
export interface PermitUpdate {
  applicantName?: string;
  applicantEmail?: string;
  workType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  urgency?: 'Low' | 'Medium' | 'High';
  status?: string;
  requiredCards?: string[];
  safetyMeasures?: string[];
}