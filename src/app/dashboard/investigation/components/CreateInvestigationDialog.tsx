"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncidentOption, HseOfficerOption } from "@/types/investigation";

interface CreateInvestigationDialogProps {
  onInvestigationCreated: () => void;
}

export default function CreateInvestigationDialog({
  onInvestigationCreated,
}: CreateInvestigationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState<IncidentOption[]>([]);
  const [hseOfficers, setHseOfficers] = useState<HseOfficerOption[]>([]);
  const [formData, setFormData] = useState({
    incidentId: "",
    hseOfficerId: "",
    rootCause: "",
    correctiveAction: "",
    preventiveAction: "",
  });

  // Fetch incidents and HSE officers data
  useEffect(() => {
    if (open) {
      fetchIncidents();
      fetchHseOfficers();
    }
  }, [open]);

const fetchIncidents = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidentreport?status=open`);
    if (response.ok) {
      const data = await response.json();
      setIncidents(
        data.map((incident: any) => ({
          incidentId: incident.incidentId,
          incidentNumber:
            incident.incidentNumber ||
            `INC${String(incident.incidentId).padStart(7, "0")}`,
          incidentTitle: incident.category || `Insiden ${incident.incidentId}`,
        }))
      );
    }
  } catch (error) {
    console.error("Error fetching incidents:", error);
  }
};

  const fetchHseOfficers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user?role=hse`);
      if (response.ok) {
        const data = await response.json();
        setHseOfficers(data.map((user: any) => ({
          hseOfficerId: user.userId,
          name: user.name,
          email: user.email
        })));
      }
    } catch (error) {
      console.error("Error fetching HSE officers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.incidentId || !formData.hseOfficerId) {
      alert("Silakan pilih insiden dan petugas HSE");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investigation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incidentId: parseInt(formData.incidentId),
          hseOfficerId: parseInt(formData.hseOfficerId),
          rootCause: formData.rootCause || undefined,
          correctiveAction: formData.correctiveAction || undefined,
          preventiveAction: formData.preventiveAction || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setOpen(false);
      onInvestigationCreated();
      setFormData({
        incidentId: "",
        hseOfficerId: "",
        rootCause: "",
        correctiveAction: "",
        preventiveAction: "",
      });
    } catch (err: any) {
      console.error("Create investigation error:", err);
      alert(`Error creating investigation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Investigasi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Buat Investigasi Baru</DialogTitle>
          <DialogDescription>
            Pilih insiden dan petugas HSE untuk membuat investigasi baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Incident Selection */}
            <div className="space-y-2">
              <Label htmlFor="incidentId">Pilih Insiden</Label>
              <Select
                value={formData.incidentId}
                onValueChange={(value) => setFormData({ ...formData, incidentId: value })}
                required
              >
                <SelectTrigger id="incidentId">
                  <SelectValue placeholder="Pilih insiden..." />
                </SelectTrigger>
                <SelectContent>
                  {incidents.map((incident) => (
                    <SelectItem key={incident.incidentId} value={incident.incidentId.toString()}>
                      {incident.incidentNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* HSE Officer Selection */}
            <div className="space-y-2">
              <Label htmlFor="hseOfficerId">Pilih Petugas HSE</Label>
              <Select
                value={formData.hseOfficerId}
                onValueChange={(value) => setFormData({ ...formData, hseOfficerId: value })}
                required
              >
                <SelectTrigger id="hseOfficerId">
                  <SelectValue placeholder="Pilih petugas HSE..." />
                </SelectTrigger>
                <SelectContent>
                  {hseOfficers.map((officer) => (
                    <SelectItem key={officer.hseOfficerId} value={officer.hseOfficerId.toString()}>
                      {officer.name} ({officer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rootCause">Penyebab Utama</Label>
            <Textarea
              id="rootCause"
              placeholder="Jelaskan penyebab utama insiden..."
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctiveAction">Tindakan Korektif</Label>
            <Textarea
              id="correctiveAction"
              placeholder="Jelaskan tindakan korektif yang akan dilakukan..."
              value={formData.correctiveAction}
              onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preventiveAction">Tindakan Preventif</Label>
            <Textarea
              id="preventiveAction"
              placeholder="Jelaskan tindakan preventif untuk mencegah terulangnya insiden..."
              value={formData.preventiveAction}
              onChange={(e) => setFormData({ ...formData, preventiveAction: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Membuat..." : "Buat Investigasi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}