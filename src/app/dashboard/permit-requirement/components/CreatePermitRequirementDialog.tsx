
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { permitRequirementApi } from "@/lib/api/permit-requirements";
import { CreatePermitRequirement } from "@/types/permit-requirement";

interface CardType {
  cardTypeId: number;
  name: string;
}

interface CreatePermitRequirementDialogProps {
  onRequirementCreated: () => void;
}

type PermitRequirementErrors = {
  [K in keyof CreatePermitRequirement]?: string;
};

export default function CreatePermitRequirementDialog({ 
  onRequirementCreated 
}: CreatePermitRequirementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [formData, setFormData] = useState<CreatePermitRequirement>({
    workType: "",
    requiredCardTypeId: 0,
    requiredTraining: "",
    notes: ""
  });

const [errors, setErrors] = useState<PermitRequirementErrors>({});


  useEffect(() => {
    if (open) {
      fetchCardTypes();
    }
  }, [open]);

  const fetchCardTypes = async () => {
    try {
      // Anda perlu membuat API untuk get card types atau gunakan mock data
      const mockCardTypes: CardType[] = [
        { cardTypeId: 1, name: "Kartu Hot Work" },
        { cardTypeId: 2, name: "Kartu Working at Height" },
        { cardTypeId: 3, name: "Kartu Confined Space" },
        { cardTypeId: 4, name: "Kartu Electrical" },
        { cardTypeId: 5, name: "Kartu APD" }
      ];
      setCardTypes(mockCardTypes);
    } catch (error) {
      console.error("Failed to fetch card types:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PermitRequirementErrors = {};

    if (!formData.workType.trim()) {
      newErrors.workType = "Jenis pekerjaan harus diisi";
    }
    if (!formData.requiredCardTypeId) {
      newErrors.requiredCardTypeId = "Kartu yang diperlukan harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await permitRequirementApi.create(formData);
      
      setFormData({ workType: "", requiredCardTypeId: 0, requiredTraining: "", notes: "" });
      setOpen(false);
      onRequirementCreated();
      
    } catch (error: any) {
      console.error("Create permit requirement error:", error);
      alert(error.message || "Gagal membuat permit requirement");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePermitRequirement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value as any }));
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
          <DialogTitle>Tambah Permit Requirement</DialogTitle>
          <DialogDescription>
            Tambahkan persyaratan permit baru berdasarkan jenis pekerjaan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workType">Jenis Pekerjaan *</Label>
            <Input
              id="workType"
              value={formData.workType}
              onChange={(e) => handleInputChange("workType", e.target.value)}
              placeholder="Contoh: Hot Work, Working at Height, Confined Space, dll"
              disabled={loading}
            />
            {errors.workType && (
              <p className="text-sm text-red-500">{errors.workType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredCardTypeId">Kartu yang Diperlukan *</Label>
            <Select
              value={formData.requiredCardTypeId.toString()}
              onValueChange={(value) => handleInputChange("requiredCardTypeId", parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kartu" />
              </SelectTrigger>
              <SelectContent>
                {cardTypes.map((type) => (
                  <SelectItem key={type.cardTypeId} value={type.cardTypeId.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.requiredCardTypeId && (
              <p className="text-sm text-red-500">{errors.requiredCardTypeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredTraining">Training yang Diperlukan</Label>
            <Input
              id="requiredTraining"
              value={formData.requiredTraining}
              onChange={(e) => handleInputChange("requiredTraining", e.target.value)}
              placeholder="Contoh: Training K3, Sertifikasi khusus, dll"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Catatan tambahan mengenai requirement ini..."
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