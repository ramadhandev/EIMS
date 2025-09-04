"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types/user";

interface CreateTrainingDialogProps {
  onCreated: () => void;
}

export default function CreateTrainingDialog({ onCreated }: CreateTrainingDialogProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [form, setForm] = useState({
    trainingName: "",
    completionDate: "",
    expiryDate: "",
    certificateURL: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch daftar user
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
      if (!response.ok) throw new Error("Gagal memuat user");
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetch users:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      alert("Pilih pengguna terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          trainingName: form.trainingName,
          completionDate: form.completionDate || null,
          expiryDate: form.expiryDate || null,
          certificateURL: form.certificateURL || null,
          notes: form.notes || null,
        }),
      });

      if (!response.ok) throw new Error("Gagal membuat training");

      setOpen(false);
      setForm({
        trainingName: "",
        completionDate: "",
        expiryDate: "",
        certificateURL: "",
        notes: "",
      });
      setSelectedUserId(null);
      onCreated();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membuat training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Pelatihan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pelatihan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 🔹 Pilih User */}
          <div>
            <Label>Nama Pengguna</Label>
            <Select onValueChange={(val) => setSelectedUserId(parseInt(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pengguna" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.userId} value={user.userId.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nama Pelatihan</Label>
            <Input
              name="trainingName"
              value={form.trainingName}
              onChange={handleChange}
              placeholder="Masukkan Nama Pelatihan"
              required
            />
          </div>
          <div>
            <Label>Tanggal Selesai</Label>
            <Input
              name="completionDate"
              type="date"
              value={form.completionDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Tanggal Expired</Label>
            <Input
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Link Sertifikat (opsional)</Label>
            <Input
              name="certificateURL"
              value={form.certificateURL}
              onChange={handleChange}
              placeholder="https://contoh.com/sertifikat.pdf"
            />
          </div>
          <div>
            <Label>Catatan (opsional)</Label>
            <Input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Tambahkan catatan"
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
