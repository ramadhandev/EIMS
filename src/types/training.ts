interface Training {
  trainingId: number;
  userId: number;
  userName: string;
  trainingName: string;
  completionDate: string; // DateTime → string
  expiryDate: string;
  certificateURL?: string;
  status: string;
  notes?: string;
}
