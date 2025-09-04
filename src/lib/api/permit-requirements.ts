import { CreatePermitRequirement, PermitRequirement, UpdatePermitRequirement } from "@/types/permit-requirement";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const permitRequirementApi = {
  // Get all permit requirements
  getAll: async (): Promise<PermitRequirement[]> => {
    const response = await fetch(`${API_URL}/permitrequirements`);
    if (!response.ok) throw new Error('Failed to fetch permit requirements');
    return response.json();
  },

  // Get by ID
  getById: async (id: number): Promise<PermitRequirement> => {
    const response = await fetch(`${API_URL}/permitrequirements/${id}`);
    if (!response.ok) throw new Error('Failed to fetch permit requirement');
    return response.json();
  },

  // Get by work type
  getByWorkType: async (workType: string): Promise<PermitRequirement> => {
    const response = await fetch(`${API_URL}/permitrequirements/work-type/${encodeURIComponent(workType)}`);
    if (!response.ok) throw new Error('Failed to fetch permit requirement by work type');
    return response.json();
  },

  // Create new
create: async (data: CreatePermitRequirement): Promise<PermitRequirement> => {
  console.log("Sending data to API:", data); // debug payload

  const response = await fetch(`${API_URL}/permitrequirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Ambil pesan error dari backend
    let errorText = "";
    try {
      errorText = await response.text();
    } catch {}
    console.error("Backend error:", errorText);
    throw new Error('Failed to create permit requirement: ' + errorText);
  }

  const result: PermitRequirement = await response.json();
  return result;
},


  // Update
  update: async (id: number, data: UpdatePermitRequirement): Promise<void> => {
    const response = await fetch(`${API_URL}/permitrequirements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update permit requirement');
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/permitrequirements/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete permit requirement');
  }
};