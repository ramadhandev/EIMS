// components/permit-detail-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PermitDetail } from "@/types/permit";
import { Approval } from "@/types/approval";

interface PermitDetailDialogProps {
  permit: PermitDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermitDetailDialog({ permit, open, onOpenChange }: PermitDetailDialogProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && permit) {
      fetchApprovals();
    }
  }, [open, permit]);

  const fetchApprovals = async () => {
    if (!permit) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/permit/${permit.permitId}`);
      if (!response.ok) throw new Error('Failed to fetch approvals');
      const data = await response.json();
      setApprovals(data);
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDecisionVariant = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "approved": return "success";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (!permit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Permit - PTW-{permit.permitId.toString().padStart(4, '0')}</DialogTitle>
          <DialogDescription>
            Informasi lengkap dan history approval permit
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Permit Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informasi Permit</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pemohon</label>
                <p className="font-medium">{permit.userName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div>
                  <Badge variant={getDecisionVariant(permit.status)}>
                    {permit.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jenis Pekerjaan</label>
                <p>{permit.workType}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Lokasi</label>
                <p>{permit.location || "-"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tanggal Mulai</label>
                <p>{formatDate(permit.startDate)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tanggal Selesai</label>
                <p>{formatDate(permit.endDate)}</p>
              </div>
              
              {permit.requiredCardTypeName && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Kartu Diperlukan</label>
                  <p>{permit.requiredCardTypeName}</p>
                </div>
              )}
              
              {permit.notes && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Catatan</label>
                  <p className="text-sm">{permit.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Approval History */}
          <div className="space-y-4">
            <h3 className="font-semibold">History Approval</h3>
            
            {loading ? (
              <p className="text-sm text-muted-foreground">Memuat history approval...</p>
            ) : approvals.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada history approval</p>
            ) : (
              <div className="space-y-3">
                {approvals.map((approval) => (
                  <div key={approval.approvalId} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{approval.approverName}</p>
                        <p className="text-sm text-muted-foreground">{approval.role}</p>
                      </div>
                      <Badge variant={getDecisionVariant(approval.decision)}>
                        {approval.decision}
                      </Badge>
                    </div>
                    
                    {approval.comment && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        "{approval.comment}"
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(approval.decisionDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}