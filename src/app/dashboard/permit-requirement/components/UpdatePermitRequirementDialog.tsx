
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
import { Edit, Loader2 } from "lucide-react";
import { permitRequirementApi } from "@/lib/api/permit-requirements";
import { PermitRequirement, UpdatePermitRequirement } from "@/types/permit-requirement";

interface CardType {
  cardTypeId: number;
  name: string;
}

interface UpdatePermitRequirementDialogProps {
  requirement: PermitRequirement;
  onRequirementUpdated: () => void;
}

export default function UpdatePermitRequirementDialog({
  requirement,
  onRequirementUpdated
}: UpdatePermitRequirementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [formData, setFormData] = useState<UpdatePermitRequirement>({
    workType: "",
    requiredCardTypeId: undefined,
    requiredTraining: "",
    notes: ""
  });

  useEffect(() => {
    if (open) {
      fetchCardTypes();
      setFormData({
        workType: requirement.workType,
        requiredCardTypeId: requirement.requiredCardTypeId,
        requiredTraining: requirement.requiredTraining || "",
        notes: requirement.notes || ""
      });
    }
  }, [open, requirement]);

  const fetchCardTypes = async () => {
    try {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await permitRequirementApi.update(requirement.requirementId, formData);
      setOpen(false);
      onRequirementUpdated();
      
    } catch (error: any) {
      console.error("Update permit requirement error:", error);
      alert(error.message || "Gagal mengupdate permit requirement");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdatePermitRequirement, value: any) => {
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
          <DialogTitle>Edit Permit Requirement</DialogTitle>
          <DialogDescription>
            Edit persyaratan permit #{requirement.requirementId}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workType">Jenis Pekerjaan</Label>
            <Input
              id="workType"
              value={formData.workType}
              onChange={(e) => handleInputChange("workType", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredCardTypeId">Kartu yang Diperlukan</Label>
            <Select
              value={formData.requiredCardTypeId?.toString()}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredTraining">Training yang Diperlukan</Label>
            <Input
              id="requiredTraining"
              value={formData.requiredTraining}
              onChange={(e) => handleInputChange("requiredTraining", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
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