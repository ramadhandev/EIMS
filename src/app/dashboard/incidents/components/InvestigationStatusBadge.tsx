// components/InvestigationStatusBadge.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Incident } from "@/types/incident";

interface InvestigationStatusBadgeProps {
  incident: Incident;
}

export default function InvestigationStatusBadge({ incident }: InvestigationStatusBadgeProps) {
  const [open, setOpen] = useState(false);

  const getInvestigationStatusVariant = () => {
    if (!incident.investigation) return "outline";
    
    if (incident.investigation.closeDate) return "success";
    if (incident.investigation.rootCause || incident.investigation.correctiveAction || incident.investigation.preventiveAction) {
      return "default";
    }
    return "outline";
  };

  const getInvestigationStatusText = () => {
    if (!incident.investigation) return "Belum Investigasi";
    
    if (incident.investigation.closeDate) return "Selesai";
    if (incident.investigation.rootCause || incident.investigation.correctiveAction || incident.investigation.preventiveAction) {
      return "Dalam Investigasi";
    }
    return "Belum Investigasi";
  };

  const hasInvestigationData = incident.investigation && (
    incident.investigation.rootCause || 
    incident.investigation.correctiveAction || 
    incident.investigation.preventiveAction
  );

  return (
    <>
      <Badge 
        variant={getInvestigationStatusVariant()}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setOpen(true)}
      >
        {getInvestigationStatusText()}
      </Badge>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Status Investigasi - {incident.incidentNumber}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {hasInvestigationData ? (
              <>
                {incident.investigation?.rootCause && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Penyebab Utama</h4>
                    <p className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-md mt-1">
                      {incident.investigation.rootCause}
                    </p>
                  </div>
                )}

                {incident.investigation?.correctiveAction && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tindakan Korektif</h4>
                    <p className="whitespace-pre-wrap text-sm bg-green-50 p-3 rounded-md mt-1">
                      {incident.investigation.correctiveAction}
                    </p>
                  </div>
                )}

                {incident.investigation?.preventiveAction && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tindakan Preventif</h4>
                    <p className="whitespace-pre-wrap text-sm bg-blue-50 p-3 rounded-md mt-1">
                      {incident.investigation.preventiveAction}
                    </p>
                  </div>
                )}

                {incident.investigation?.closeDate && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tanggal Penutupan</h4>
                    <p className="text-sm">
                      {new Date(incident.investigation.closeDate).toLocaleDateString("id-ID", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Belum ada data investigasi untuk insiden ini.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}