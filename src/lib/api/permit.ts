// src/lib/api/permits.ts
import { PermitDetail, PermitCreate, PermitUpdate } from "@/types/permit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const permitApi = {
  // Get all permits
  getPermits: async (): Promise<PermitDetail[]> => {
    const response = await fetch(`${API_URL}/permittowork`);
    if (!response.ok) throw new Error('Failed to fetch permits');
    return response.json();
  },

  // Get permit by ID
  getPermit: async (id: number): Promise<PermitDetail> => {
    const response = await fetch(`${API_URL}/permittowork/${id}`);
    if (!response.ok) throw new Error('Failed to fetch permit');
    return response.json();
  },

  // Create new permit
  createPermit: async (permitData: PermitCreate): Promise<PermitDetail> => {
    const response = await fetch(`${API_URL}/permittowork`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permitData),
    });
    if (!response.ok) throw new Error('Failed to create permit');
    return response.json();
  },

  // Update permit
  updatePermit: async (id: number, permitData: PermitUpdate): Promise<PermitDetail> => {
    const response = await fetch(`${API_URL}/permits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permitData),
    });
    if (!response.ok) throw new Error('Failed to update permit');
    return response.json();
  },

  // Delete permit
  deletePermit: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/permits/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete permit');
  },

  // Approve permit
  approvePermit: async (id: number): Promise<PermitDetail> => {
    const response = await fetch(`${API_URL}/permits/${id}/approve`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to approve permit');
    return response.json();
  },

  // Reject permit
  rejectPermit: async (id: number, reason: string): Promise<PermitDetail> => {
    const response = await fetch(`${API_URL}/permits/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to reject permit');
    return response.json();
  }
};