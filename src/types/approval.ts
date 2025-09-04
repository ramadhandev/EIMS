

export interface ApprovalWithPermit extends Approval {
  permitData?: {
    permitId: number;
    workType: string;
    location?: string;
    userName: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export interface Approval {
  approvalId: number;
  permitId: number;
  approverId: number;
  approverName: string;
  role: string;
  decision: string;
  decisionDate: string; // Pastikan ini ada
  comment?: string;
}


export interface ApprovalFilters {
  role: string;
  decision: string;
  approver: string;
}