import { ApprovalWithPermit } from "@/types/approval";


export const approvalApi = {
  // Get all approvals with permit data
  getApprovalsWithPermit: async (): Promise<ApprovalWithPermit[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/with-permit`);
    if (!response.ok) throw new Error('Failed to fetch approvals with permit data');
    return response.json();
  },

  // Get approvals by approver ID with permit data
  getApprovalsByApproverWithPermit: async (approverId: number): Promise<ApprovalWithPermit[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/approver/${approverId}/with-permit`);
    if (!response.ok) throw new Error('Failed to fetch approvals with permit data');
    return response.json();
  },

  // Get pending approvals with permit data
  getPendingApprovalsWithPermit: async (approverId: number): Promise<ApprovalWithPermit[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/approver/${approverId}/pending/with-permit`);
    if (!response.ok) throw new Error('Failed to fetch pending approvals with permit data');
    return response.json();
  }
};