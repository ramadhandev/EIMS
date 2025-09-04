// src/app/dashboard/hse-cards/components/CreateCardDialog.tsx
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
import { Plus } from "lucide-react";

interface User {
  userId: number;
  name: string;
  email: string;
}

interface CardType {
  cardTypeId: number;
  name: string;
}

interface CreateCardDialogProps {
  onCardCreated: () => void;
}

interface FormData {
  userId: number;
  cardNumber: string;
  cardTypeId: number;
  issuedBy: number;
  issuedDate: string;
  expiredDate: string;
  notes: string;
}

export default function CreateCardDialog({ onCardCreated }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(1); // Default, bisa dari auth

  const [formData, setFormData] = useState<FormData>({
    userId: 0,
    cardNumber: "",
    cardTypeId: 0,
    issuedBy: 1, // Default to current user
    issuedDate: new Date().toISOString().split('T')[0],
    expiredDate: "",
    notes: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});


  // Fetch users and card types when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchCardTypes();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  

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

  const validateForm = (): boolean => {
     const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.userId) newErrors.userId = "Pemegang kartu harus dipilih";
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Nomor kartu harus diisi";
    if (!formData.cardTypeId) newErrors.cardTypeId = "Jenis kartu harus dipilih";
    if (!formData.expiredDate) newErrors.expiredDate = "Tanggal expired harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare payload sesuai dengan backend
      const payload = {
        userId: formData.userId,
        cardNumber: formData.cardNumber,
        cardTypeId: formData.cardTypeId,
        issuedBy: currentUserId, // Gunakan current user ID
        issuedDate: new Date(formData.issuedDate).toISOString(),
        expiredDate: new Date(formData.expiredDate).toISOString(),
        notes: formData.notes || null
      };

      console.log("Sending payload:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hsecards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal membuat kartu: ${response.status} - ${errorText}`);
      }

      // Reset form
      setFormData({
        userId: 0,
        cardNumber: "",
        cardTypeId: 0,
        issuedBy: currentUserId,
        issuedDate: new Date().toISOString().split('T')[0],
        expiredDate: "",
        notes: ""
      });

      setOpen(false);
      onCardCreated();
      
      alert("Kartu HSE berhasil dibuat!");
      
    } catch (error: any) {
      console.error("Create card error:", error);
      alert(error.message || "Gagal membuat kartu. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kartu
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Kartu HSE Baru</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk menambahkan kartu HSE baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="userId">Pemegang Kartu *</Label>
            <Select
              value={formData.userId.toString()}
              onValueChange={(value) => handleInputChange("userId", parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pemegang kartu" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.userId} value={user.userId.toString()}>
                    {user.name} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId}</p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Nomor Kartu *</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="Contoh: HSE-2024-001"
              disabled={loading}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Card Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="cardTypeId">Jenis Kartu *</Label>
            <Select
              value={formData.cardTypeId.toString()}
              onValueChange={(value) => handleInputChange("cardTypeId", parseInt(value))}
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
            {errors.cardTypeId && (
              <p className="text-sm text-red-500">{errors.cardTypeId}</p>
            )}
          </div>

          {/* Issued Date */}
          <div className="space-y-2">
            <Label htmlFor="issuedDate">Tanggal Terbit *</Label>
            <Input
              id="issuedDate"
              type="date"
              value={formData.issuedDate}
              onChange={(e) => handleInputChange("issuedDate", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Expired Date */}
          <div className="space-y-2">
            <Label htmlFor="expiredDate">Tanggal Expired *</Label>
            <Input
              id="expiredDate"
              type="date"
              value={formData.expiredDate}
              onChange={(e) => handleInputChange("expiredDate", e.target.value)}
              disabled={loading}
              min={formData.issuedDate} // Pastikan expired date tidak sebelum issued date
            />
            {errors.expiredDate && (
              <p className="text-sm text-red-500">{errors.expiredDate}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
             onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notes", e.target.value)}
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
              className="min-w-[100px]"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}