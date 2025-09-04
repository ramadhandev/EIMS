
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QuickActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject" | "pending";
  approvalId: number;
  onSuccess: () => void;
}

export default function QuickActionModal({
  open,
  onOpenChange,
  action,
  approvalId,
  onSuccess
}: QuickActionModalProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const getActionDetails = () => {
    switch (action) {
      case "approve":
        return { title: "Setujui Persetujuan", description: "Anda akan menyetujui permintaan ini.", placeholder: "Tambahkan komentar (opsional)..." };
      case "reject":
        return { title: "Tolak Persetujuan", description: "Anda akan menolak permintaan ini.", placeholder: "Berikan alasan penolakan..." };
      case "pending":
        return { title: "Set ke Pending", description: "Anda akan mengubah status menjadi pending.", placeholder: "Tambahkan catatan..." };
      default:
        return { title: "", description: "", placeholder: "" };
    }
  };

  const { title, description, placeholder } = getActionDetails();

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      let endpoint;
      let method;
      let body;

      if (action === "pending") {
        // Untuk pending, gunakan PUT ke endpoint utama
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/approvals/${approvalId}`;
        method = "PUT";
        body = JSON.stringify({
          decision: "Pending",
          comment: comment || undefined,
        });
      } else {
        // Untuk approve/reject, gunakan PATCH ke endpoint khusus
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/approvals/${approvalId}/${action}`;
        method = "PATCH";
        body = comment ? JSON.stringify(comment) : null;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onOpenChange(false);
      setComment("");
      onSuccess();
      alert(`Berhasil ${action === "approve" ? "menyetujui" : action === "reject" ? "menolak" : "mengubah status"} persetujuan!`);
    } catch (err: any) {
      console.error(`${action} error:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">
              {action === "approve" ? "Komentar (opsional)" : action === "reject" ? "Alasan penolakan" : "Catatan"}
            </Label>
            <Textarea
              id="comment"
              placeholder={placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="button"
              variant={action === "approve" ? "default" : action === "reject" ? "destructive" : "secondary"}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Memproses..." : action === "approve" ? "Setujui" : action === "reject" ? "Tolak" : "Set Pending"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}