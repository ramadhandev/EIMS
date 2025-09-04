
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

interface ApproveRejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject" | "pending";
  approvalId: number;
  onSuccess: () => void;
}

export default function ApproveRejectModal({
  open,
  onOpenChange,
  action,
  approvalId,
  onSuccess
}: ApproveRejectModalProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const getActionDetails = () => {
    switch (action) {
      case "approve":
        return { 
          title: "Setujui Persetujuan", 
          description: "Anda akan menyetujui permintaan ini.", 
          placeholder: "Tambahkan komentar (opsional)...",
          buttonText: "Setujui",
          variant: "default" as const
        };
      case "reject":
        return { 
          title: "Tolak Persetujuan", 
          description: "Anda akan menolak permintaan ini.", 
          placeholder: "Berikan alasan penolakan...",
          buttonText: "Tolak",
          variant: "destructive" as const
        };
      case "pending":
        return { 
          title: "Set ke Pending", 
          description: "Anda akan mengubah status menjadi pending.", 
          placeholder: "Tambahkan catatan...",
          buttonText: "Set Pending",
          variant: "secondary" as const
        };
      default:
        return { title: "", description: "", placeholder: "", buttonText: "", variant: "default" as const };
    }
  };

  const { title, description, placeholder, buttonText, variant } = getActionDetails();

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
          // decisionDate akan diupdate otomatis oleh backend
        });
      } else {
        // Untuk approve/reject, gunakan PATCH ke endpoint khusus
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/approvals/${approvalId}/${action}`;
        method = "PATCH";
        body = comment ? JSON.stringify(comment) : null;
      }

      console.log("Sending request to:", endpoint);
      console.log("Method:", method);
      console.log("Body:", body);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
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
              variant={variant}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Memproses..." : buttonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}