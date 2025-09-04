export interface Investigation {
  investigationId: number;
  incidentId: number;
  hseOfficerId: number;
  incidentTitle?: string;
  hseOfficerName: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  closeDate?: Date;
}

export interface InvestigationFilters {
  hseOfficerId: string;
  status: string;
}

export interface CreateInvestigationDto {
  incidentId: number;
  hseOfficerId: number;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

export interface UpdateInvestigationDto {
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  closeDate?: Date;
}

export interface IncidentOption {
  incidentId: number;
  incidentTitle: string;
  incidentNumber: string;
}

export interface HseOfficerOption {
  hseOfficerId: number;
  name: string;
  email: string;
}