"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Eye, ZoomIn, ZoomOut, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Incident } from "@/types/incident";



interface ViewIncidentDialogProps {
  incident: Incident;
}

export default function ViewIncidentDialog({ incident }: ViewIncidentDialogProps) {
  const [open, setOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleImageClick = () => {
    setImagePreviewOpen(true);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reported':
        return 'secondary';
      case 'investigating':
        return 'default';
      case 'in progress':
        return 'default';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="cursor-pointer w-full justify-start">
            <p className="h-4 w-4 mr-2"> Lihat Detail</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Detail Laporan Insiden</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                <h4 className="text-sm font-medium text-muted-foreground">Nomor Insiden</h4>
                 <p className="font-semibold">
                {incident.incidentNumber || `INC${String(incident.incidentId).padStart(7, '0')}`}
                 </p>
                </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <Badge variant={getStatusVariant(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Pelapor</h4>
                  <p>{incident.userName}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tanggal & Waktu</h4>
                  <p>{new Date(incident.date).toLocaleDateString("id-ID", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Lokasi</h4>
                  <p>{incident.location || "-"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Kategori</h4>
                  <p>{incident.category}</p>
                </div>

                {incident.description && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Deskripsi</h4>
                    <p className="whitespace-pre-wrap">{incident.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {incident.photoURL && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Bukti Foto</h4>
                  <div 
                    className="relative group cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <img
                      src={incident.photoURL}
                      alt="Bukti Insiden"
                      className="w-full h-48 object-cover rounded-md border transition-transform group-hover:scale-105"
                    />
                    <div className="absolute  bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-md flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Klik gambar untuk melihat preview
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <AlertDialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black bg-opacity-90 border-0">
           <AlertDialogTitle>
      <VisuallyHidden>Preview Bukti Insiden</VisuallyHidden>
    </AlertDialogTitle>

          <div className="relative flex items-center justify-center h-full p-8">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white hover:bg-opacity-20"
              onClick={() => setImagePreviewOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={incident.photoURL}
                alt="Preview Bukti Insiden"
                className="max-w-full max-h-full object-contain"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 rounded-full p-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              
              <span className="text-white text-sm flex items-center px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}