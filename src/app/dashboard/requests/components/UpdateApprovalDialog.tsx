
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Approval } from "@/types/approval";

interface UpdateApprovalDialogProps {
  approval: Approval;
  onApprovalUpdated: () => void;
  children?: React.ReactNode;
}

export default function UpdateApprovalDialog({
  approval,
  onApprovalUpdated,
  children
}: UpdateApprovalDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    decision: approval.decision,
    comment: approval.comment || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/${approval.approvalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: formData.decision,
          comment: formData.comment || undefined,
          // decisionDate akan diupdate otomatis oleh backend saat status berubah
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setOpen(false);
      onApprovalUpdated();
      alert("Berhasil memperbarui status persetujuan!");
    } catch (err: any) {
      console.error("Update approval error:", err);
      alert(`Error updating approval: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <button className="w-full text-left">Edit Status</button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ubah Status Persetujuan</DialogTitle>
          <DialogDescription>
            Ubah status dan komentar persetujuan. Tanggal keputusan akan diupdate otomatis.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decision">Status</Label>
            <Select
              value={formData.decision}
              onValueChange={(value) => setFormData({ ...formData, decision: value })}
              required
            >
              <SelectTrigger id="decision">
                <SelectValue placeholder="Pilih status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Disetujui</SelectItem>
                <SelectItem value="Rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Komentar</Label>
            <Textarea
              id="comment"
              placeholder="Masukkan komentar..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Memperbarui..." : "Perbarui Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}