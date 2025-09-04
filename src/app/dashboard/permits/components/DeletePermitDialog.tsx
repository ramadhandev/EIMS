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
import { Trash2, Loader2 } from "lucide-react";
import { PermitDetail } from "@/types/permit";

interface DeletePermitDialogProps {
  permit: PermitDetail;
  onPermitDeleted: () => void;
}

export default function DeletePermitDialog({ permit, onPermitDeleted }: DeletePermitDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("Deleting permit with ID:", permit.permitId);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permittowork/${permit.permitId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = "Gagal menghapus permit";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      setOpen(false);
      onPermitDeleted();
      console.log("Permit deleted successfully");
      
    } catch (error: any) {
      console.error("Delete permit error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-red-600 hover:text-red-700 cursor-pointer hover:bg-red-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Hapus Permit Kerja</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus permit kerja ini?
            <br />
            <span className="font-semibold">PTW-{permit.permitId.toString().padStart(4, '0')} - {permit.workType}</span>
            <br />
            <span className="text-red-500 text-sm">Tindakan ini tidak dapat dibatalkan.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-3 rounded-md text-sm">
          <p className="font-medium mb-2">Detail Permit:</p>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-muted-foreground">Pemohon:</span>
            <span>{permit.userName}</span>
            <span className="text-muted-foreground">Lokasi:</span>
            <span>{permit.location || "-"}</span>
            <span className="text-muted-foreground">Jenis Pekerjaan:</span>
            <span>{permit.workType}</span>
            <span className="text-muted-foreground">Status:</span>
            <span>{permit.status}</span>
            <span className="text-muted-foreground">Tanggal:</span>
            <span>{new Date(permit.startDate).toLocaleDateString("id-ID")} - {new Date(permit.endDate).toLocaleDateString("id-ID")}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}