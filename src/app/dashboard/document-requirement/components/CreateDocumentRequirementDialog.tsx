
"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { documentRequirementApi } from "@/lib/api/document-requirements";
import { CreateDocumentRequirement } from "@/types/document-requirement";

interface CreateDocumentRequirementDialogProps {
  onRequirementCreated: () => void;
}

export default function CreateDocumentRequirementDialog({ 
  onRequirementCreated 
}: CreateDocumentRequirementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDocumentRequirement>({
    name: "",
    description: ""
  });

  const [errors, setErrors] = useState<Partial<CreateDocumentRequirement>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDocumentRequirement> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await documentRequirementApi.create(formData);
      
      setFormData({ name: "", description: "" });
      setOpen(false);
      onRequirementCreated();
      
    } catch (error: any) {
      console.error("Create document requirement error:", error);
      alert(error.message || "Gagal membuat document requirement");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateDocumentRequirement, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Requirement
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Document Requirement</DialogTitle>
          <DialogDescription>
            Tambahkan persyaratan dokumen baru untuk sistem
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Requirement *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Contoh: Surat Izin Kerja, Sertifikat K3, dll"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Deskripsi detail tentang requirement ini..."
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
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}