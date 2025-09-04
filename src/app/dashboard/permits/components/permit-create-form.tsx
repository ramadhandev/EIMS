// src/app/dashboard/permits/components/permit-create-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { permitApi } from "@/lib/api/permit";
import { User } from "@/types/user";
import { CardType } from "@/types/card-type";

interface PermitCreateFormProps {
  onSuccess: () => void;
}

export function PermitCreateForm({ onSuccess }: PermitCreateFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [cardTypesLoading, setCardTypesLoading] = useState(true);

  const [formData, setFormData] = useState({
    userId: 0,
    workType: "",
    location: "",
    startDate: "",
    endDate: "",
    requiredCardTypeId: 0,
    notes: ""
  });

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Gagal memuat data pengguna');
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch card types data
  const fetchCardTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cardtype`);
      if (!response.ok) throw new Error('Failed to fetch card types');
      const data = await response.json();
      setCardTypes(data);
    } catch (err) {
      console.error('Failed to fetch card types:', err);
      setError('Gagal memuat data jenis kartu');
    } finally {
      setCardTypesLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchCardTypes();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await permitApi.createPermit({
         userId: formData.userId,
  workType: formData.workType,
  location: formData.location || undefined,
  startDate: formData.startDate,
  endDate: formData.endDate,
  requiredCardTypeId: formData.requiredCardTypeId,
  notes: formData.notes || undefined
      });

      setOpen(false);
      onSuccess();
      // Reset form
      setFormData({
        userId: 0,
        workType: "",
        location: "",
        startDate: "",
        endDate: "",
        requiredCardTypeId: 0,
        notes: ""
      });
    } catch (err: any) {
      setError(err.message || "Gagal membuat permit");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Buat Permit Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Permit Kerja Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="userId">Pemohon *</Label>
            <Select
              value={formData.userId ? formData.userId.toString() : ""}
              onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, userId: parseInt(value) }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Pemohon" />
              </SelectTrigger>
              <SelectContent>
                {usersLoading ? (
                  <SelectItem value="loading" disabled>
                    Memuat data pengguna...
                  </SelectItem>
                ) : users.length === 0 ? (
                  <SelectItem value="no-data" disabled>
                    Tidak ada data pengguna
                  </SelectItem>
                ) : (
                  users.map((user) => (
                    <SelectItem key={user.userId} value={user.userId.toString()}>
                      {user.name} {user.department && `- ${user.department}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Work Type */}
          <div className="space-y-2">
            <Label htmlFor="workType">Jenis Pekerjaan *</Label>
            <Select
              value={formData.workType}
              onValueChange={(value) => handleSelectChange("workType", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenis Pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Masukkan lokasi pekerjaan"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Required Card Type */}
          <div className="space-y-2">
            <Label htmlFor="requiredCardTypeId">Jenis Kartu Diperlukan</Label>
            <Select
          value={formData.requiredCardTypeId ? formData.requiredCardTypeId.toString() : ""}
          onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, requiredCardTypeId: parseInt(value) }))
          }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenis Kartu" />
              </SelectTrigger>
              <SelectContent>
                {cardTypesLoading ? (
                  <SelectItem value="loading" disabled>
                    Memuat data jenis kartu...
                  </SelectItem>
                ) : cardTypes.length === 0 ? (
                  <SelectItem value="no-data" disabled>
                    Tidak ada data jenis kartu
                  </SelectItem>
                ) : (
                  cardTypes.map((cardType) => (
                    <SelectItem key={cardType.cardTypeId} value={cardType.cardTypeId.toString()}>
                      {cardType.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tambahkan catatan jika diperlukan"
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Membuat..." : "Buat Permit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}