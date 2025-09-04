
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
import { Approval } from "@/types/approval";

interface DeleteApprovalDialogProps {
  approval: Approval;
  onApprovalDeleted: () => void;
  children?: React.ReactNode;
}

export default function DeleteApprovalDialog({
  approval,
  onApprovalDeleted,
  children
}: DeleteApprovalDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/${approval.approvalId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setOpen(false);
      onApprovalDeleted();
      alert("Berhasil menghapus persetujuan!");
    } catch (err: any) {
      console.error("Delete approval error:", err);
      alert(`Error deleting approval: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <button className="w-full text-left text-red-600">Hapus</button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Hapus Persetujuan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus persetujuan ini? 
            <br />
            <strong>ID: {approval.approvalId}</strong> - Permit: {approval.permitId}
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            type="button" 
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