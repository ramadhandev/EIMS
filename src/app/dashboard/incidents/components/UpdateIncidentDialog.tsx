"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Incident {
  incidentId: number;
  location?: string;
  description?: string;
  photoURL?: string;
  status?: string;
}

interface UpdateIncidentDialogProps {
  incident: Incident;
  onUpdated: () => void;
}

export default function UpdateIncidentDialog({ incident, onUpdated }: UpdateIncidentDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    location: incident.location || "",
    description: incident.description || "",
    photoURL: incident.photoURL || "",
    status: incident.status || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/IncidentReport/${incident.incidentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Gagal update laporan insiden");

      setOpen(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update insiden");
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
          <DialogTitle>Update Laporan Insiden</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Lokasi</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <Label>URL Foto</Label>
            <Input
              value={form.photoURL}
              onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Input
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
