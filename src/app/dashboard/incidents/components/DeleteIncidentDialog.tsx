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

interface Incident {
  incidentId: number;
  category: string;
}

interface DeleteIncidentDialogProps {
  incident: Incident;
  onDeleted: () => void;
}

export default function DeleteIncidentDialog({ incident, onDeleted }: DeleteIncidentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/IncidentReport/${incident.incidentId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Gagal hapus laporan insiden");

      setOpen(false);
      onDeleted();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat hapus insiden");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-600">
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Laporan Insiden</DialogTitle>
        </DialogHeader>
        <p>
          Apakah Anda yakin ingin menghapus laporan kategori{" "}
          <b>{incident.category}</b>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
