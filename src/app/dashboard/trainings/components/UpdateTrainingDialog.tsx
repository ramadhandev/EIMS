"use client";

import { useState } from "react";
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

interface Training {
  trainingId: number;
  trainingName?: string;
  completionDate?: string;
  expiryDate?: string;
  certificateURL?: string;
  status?: string;
  notes?: string;
}

interface UpdateTrainingDialogProps {
  training: Training;
  onUpdated: () => void;
}

export default function UpdateTrainingDialog({
  training,
  onUpdated,
}: UpdateTrainingDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Training>({
    ...training,
    completionDate: training.completionDate
      ? training.completionDate.split("T")[0]
      : "",
    expiryDate: training.expiryDate ? training.expiryDate.split("T")[0] : "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trainings/${training.trainingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trainingName: form.trainingName,
            completionDate: form.completionDate || null,
            expiryDate: form.expiryDate || null,
            certificateURL: form.certificateURL || null,
            status: form.status || null,
            notes: form.notes || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Gagal memperbarui training");

      setOpen(false);
      onUpdated();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pelatihan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nama Pelatihan</Label>
            <Input
              name="trainingName"
              value={form.trainingName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Tanggal Selesai</Label>
            <Input
              name="completionDate"
              type="date"
              value={form.completionDate || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Tanggal Expired</Label>
            <Input
              name="expiryDate"
              type="date"
              value={form.expiryDate || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Link Sertifikat</Label>
            <Input
              name="certificateURL"
              value={form.certificateURL || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Input
              name="status"
              value={form.status || ""}
              onChange={handleChange}
              placeholder="Contoh: Active / Expired / Pending"
            />
          </div>
          <div>
            <Label>Catatan</Label>
            <Input
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
