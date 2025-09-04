
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
import { documentRequirementApi } from "@/lib/api/document-requirements";
import { DocumentRequirement } from "@/types/document-requirement";

interface DeleteDocumentRequirementDialogProps {
  requirement: DocumentRequirement;
  onRequirementDeleted: () => void;
}

export default function DeleteDocumentRequirementDialog({
  requirement,
  onRequirementDeleted
}: DeleteDocumentRequirementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await documentRequirementApi.delete(requirement.documentRequirementId);
      setOpen(false);
      onRequirementDeleted();
      
    } catch (error: any) {
      console.error("Delete document requirement error:", error);
      alert(error.message || "Gagal menghapus document requirement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Hapus Document Requirement</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus requirement ini?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Detail Requirement:</h4>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">ID:</span> #{requirement.documentRequirementId}</p>
            <p><span className="font-medium">Nama:</span> {requirement.name}</p>
            {requirement.description && (
              <p><span className="font-medium">Deskripsi:</span> {requirement.description}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-red-600 font-medium">
          ⚠️ Tindakan ini tidak dapat dibatalkan.
        </p>

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
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Ya, Hapus
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}