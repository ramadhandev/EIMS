
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import { documentRequirementApi } from "@/lib/api/document-requirements";
import { DocumentRequirement, UpdateDocumentRequirement } from "@/types/document-requirement";

interface UpdateDocumentRequirementDialogProps {
  requirement: DocumentRequirement;
  onRequirementUpdated: () => void;
}

export default function UpdateDocumentRequirementDialog({
  requirement,
  onRequirementUpdated
}: UpdateDocumentRequirementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateDocumentRequirement>({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: requirement.name,
        description: requirement.description || ""
      });
    }
  }, [open, requirement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await documentRequirementApi.update(requirement.documentRequirementId, formData);
      setOpen(false);
      onRequirementUpdated();
      
    } catch (error: any) {
      console.error("Update document requirement error:", error);
      alert(error.message || "Gagal mengupdate document requirement");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateDocumentRequirement, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Document Requirement</DialogTitle>
          <DialogDescription>
            Edit persyaratan dokumen #{requirement.documentRequirementId}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Requirement</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={loading}
              rows={3}
            />
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}