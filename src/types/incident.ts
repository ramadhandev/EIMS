export interface Incident {
  incidentId: number;
  incidentNumber: string;
  userId: number;
  userName: string;
  date: string;
  location?: string;
  category: string;
  description?: string;
  photoURL?: string;
  status: string;
  investigation?: { // TAMBAHKAN DATA INVESTIGASI
    rootCause?: string;
    correctiveAction?: string;
    preventiveAction?: string;
    closeDate?: string;
  };
}