// src/types/hse-card.ts
export interface HSECard {
  cardId: number;
  userId: number;
  userName: string;
  cardNumber: string;
  cardTypeId: number;
  cardTypeName: string;
  issuedBy: number;
  issuedByName: string;
  issuedDate: string;
  expiredDate: string;
  status: string;
  notes?: string;
}

export interface HSECardCreate {
  userId: number;
  cardNumber: string;
  cardTypeId: number;
  issuedBy: number;
  issuedDate: string;
  expiredDate: string;
  notes?: string;
}

export interface HSECardUpdate {
  userId?: number;
  cardNumber?: string;
  cardTypeId?: number;
  issuedBy?: number;
  issuedDate?: string;
  expiredDate?: string;
  status?: string;
  notes?: string;
}