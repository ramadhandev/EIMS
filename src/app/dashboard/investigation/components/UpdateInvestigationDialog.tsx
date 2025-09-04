"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Investigation } from "@/types/investigation";

interface UpdateInvestigationDialogProps {
  investigation: Investigation;
  onInvestigationUpdated: () => void;
}

export default function UpdateInvestigationDialog({
  investigation,
  onInvestigationUpdated,
}: UpdateInvestigationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rootCause: investigation.rootCause || "",
    correctiveAction: investigation.correctiveAction || "",
    preventiveAction: investigation.preventiveAction || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investigation/${investigation.investigationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rootCause: formData.rootCause || undefined,
          correctiveAction: formData.correctiveAction || undefined,
          preventiveAction: formData.preventiveAction || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setOpen(false);
      onInvestigationUpdated();
    } catch (err: any) {
      console.error("Update investigation error:", err);
      alert(`Error updating investigation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left">Edit</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Investigasi</DialogTitle>
          <DialogDescription>
            Perbarui informasi investigasi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rootCause">Penyebab Utama</Label>
            <Textarea
              id="rootCause"
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correctiveAction">Tindakan Korektif</Label>
            <Textarea
              id="correctiveAction"
              value={formData.correctiveAction}
              onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preventiveAction">Tindakan Preventif</Label>
            <Textarea
              id="preventiveAction"
              value={formData.preventiveAction}
              onChange={(e) => setFormData({ ...formData, preventiveAction: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Memperbarui..." : "Perbarui"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}