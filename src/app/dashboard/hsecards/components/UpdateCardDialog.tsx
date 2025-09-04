
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";

interface CardType {
  cardTypeId: number;
  name: string;
}

interface HSECard {
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

interface UpdateCardDialogProps {
  card: HSECard;
  onCardUpdated: () => void;
}

interface FormData {
  cardNumber?: string;
  cardTypeId?: number;
  issuedBy?: number;
  expiredDate?: string;
  status?: string;
  notes?: string;
}

export default function UpdateCardDialog({ card, onCardUpdated }: UpdateCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    cardTypeId: undefined,
    issuedBy: undefined,
    expiredDate: "",
    status: "",
    notes: ""
  });

  // Fetch card types when dialog opens
  useEffect(() => {
    if (open) {
      fetchCardTypes();
      // Set initial form data from card prop
      setFormData({
        cardNumber: card.cardNumber,
        cardTypeId: card.cardTypeId,
        issuedBy: card.issuedBy,
        expiredDate: card.expiredDate.split('T')[0], // Format YYYY-MM-DD
        status: card.status,
        notes: card.notes || ""
      });
    }
  }, [open, card]);

  const fetchCardTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cardtype`);
      if (response.ok) {
        const data = await response.json();
        setCardTypes(data);
      }
    } catch (error) {
      console.error("Failed to fetch card types:", error);
      // Fallback data jika endpoint belum ada
      setCardTypes([
        { cardTypeId: 1, name: "Kartu APD" },
        { cardTypeId: 2, name: "Kartu Keselamatan" },
        { cardTypeId: 3, name: "Kartu K3" }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // Prepare payload - hanya kirim field yang diubah
      const payload: FormData = {};
      
      if (formData.cardNumber !== card.cardNumber) {
        payload.cardNumber = formData.cardNumber;
      }
      if (formData.cardTypeId !== card.cardTypeId) {
        payload.cardTypeId = formData.cardTypeId;
      }
      if (formData.issuedBy !== card.issuedBy) {
        payload.issuedBy = formData.issuedBy;
      }
      if (formData.expiredDate && formData.expiredDate !== card.expiredDate.split('T')[0]) {
        payload.expiredDate = new Date(formData.expiredDate).toISOString();
      }
      if (formData.status !== card.status) {
        payload.status = formData.status;
      }
      if (formData.notes !== card.notes) {
        payload.notes = formData.notes;
      }

      // Jika tidak ada yang diubah, tidak perlu kirim request
      if (Object.keys(payload).length === 0) {
        setOpen(false);
        return;
      }

      console.log("Sending update payload:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hsecards/${card.cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengupdate kartu: ${response.status} - ${errorText}`);
      }

      setOpen(false);
      onCardUpdated();
      
      alert("Kartu HSE berhasil diupdate!");
      
    } catch (error: any) {
      console.error("Update card error:", error);
      alert(error.message || "Gagal mengupdate kartu. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Kartu HSE</DialogTitle>
          <DialogDescription>
            Edit informasi kartu {card.cardNumber} - {card.userName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Nomor Kartu</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber || ""}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="Nomor kartu"
              disabled={loading}
            />
          </div>

          {/* Card Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="cardTypeId">Jenis Kartu</Label>
            <Select
              value={formData.cardTypeId?.toString() || ""}
              onValueChange={(value) => handleInputChange("cardTypeId", value ? parseInt(value) : undefined)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kartu" />
              </SelectTrigger>
              <SelectContent>
                {cardTypes.map((type) => (
                  <SelectItem key={type.cardTypeId} value={type.cardTypeId.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || ""}
              onValueChange={(value) => handleInputChange("status", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Aktif</SelectItem>
                <SelectItem value="Expired">Kadaluarsa</SelectItem>
                <SelectItem value="Revoked">Ditarik</SelectItem>
                <SelectItem value="Pending">Menunggu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expired Date */}
          <div className="space-y-2">
            <Label htmlFor="expiredDate">Tanggal Expired</Label>
            <Input
              id="expiredDate"
              type="date"
              value={formData.expiredDate || ""}
              onChange={(e) => handleInputChange("expiredDate", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Catatan tambahan..."
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}