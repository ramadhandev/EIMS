// D:\Project_api\leash\eims-app\src\lib\api\hse-cards.ts
import { HSECard, HSECardCreate, HSECardUpdate } from "@/types/hsecards";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const hseCardApi = {
  // Get all HSE cards
  getCards: async (): Promise<HSECard[]> => {
    const response = await fetch(`${API_URL}/hsecards`);
    if (!response.ok) throw new Error('Failed to fetch HSE cards');
    return response.json();
  },

  // Get card by ID
  getCard: async (id: number): Promise<HSECard> => {
    const response = await fetch(`${API_URL}/hsecards/${id}`);
    if (!response.ok) throw new Error('Failed to fetch HSE card');
    return response.json();
  },

  // Create new card
  createCard: async (cardData: HSECardCreate): Promise<HSECard> => {
    const response = await fetch(`${API_URL}/hsecards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    });
    if (!response.ok) throw new Error('Failed to create HSE card');
    return response.json();
  },

  // Update card
  updateCard: async (id: number, cardData: HSECardUpdate): Promise<HSECard> => {
    const response = await fetch(`${API_URL}/hsecards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    });
    if (!response.ok) throw new Error('Failed to update HSE card');
    return response.json();
  },

  // Delete card
  deleteCard: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/hsecards/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete HSE card');
  },

  // Renew expired card
  renewCard: async (id: number, newExpiryDate: string): Promise<HSECard> => {
    const response = await fetch(`${API_URL}/hsecards/${id}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiredDate: newExpiryDate }),
    });
    if (!response.ok) throw new Error('Failed to renew HSE card');
    return response.json();
  }
};