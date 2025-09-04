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

interface Training {
  trainingId: number;
  trainingName?: string;
}

interface DeleteTrainingDialogProps {
  training: Training;
  onDeleted: () => void;
}

export default function DeleteTrainingDialog({
  training,
  onDeleted,
}: DeleteTrainingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trainings/${training.trainingId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus training");

      setOpen(false);
      onDeleted();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus training");
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
          <DialogTitle>Hapus Pelatihan</DialogTitle>
        </DialogHeader>
        <p>
          Apakah Anda yakin ingin menghapus pelatihan{" "}
          <b>{training.trainingName || "Tanpa Nama"}</b>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
