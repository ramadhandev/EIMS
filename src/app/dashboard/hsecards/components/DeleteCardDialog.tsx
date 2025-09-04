
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

interface HSECard {
  cardId: number;
  userId: number;
  userName: string;
  cardNumber: string;
  cardTypeId: number;
  cardTypeName: string;
  issuedBy: number;
  issuedByName: string;
  issuedDate: string;
  expiredDate: string;
  status: string;
  notes?: string;
}

interface DeleteCardDialogProps {
  card: HSECard;
  onCardDeleted: () => void;
}

export default function DeleteCardDialog({ card, onCardDeleted }: DeleteCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("Deleting card with ID:", card.cardId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hsecards/${card.cardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menghapus kartu: ${response.status} - ${errorText}`);
      }

      setOpen(false);
      onCardDeleted();
      
      alert("Kartu HSE berhasil dihapus!");
      
    } catch (error: any) {
      console.error("Delete card error:", error);
      alert(error.message || "Gagal menghapus kartu. Silakan coba lagi.");
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
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Hapus Kartu HSE</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus kartu ini?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Card Details */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Detail Kartu:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Nomor Kartu:</div>
              <div className="font-medium">{card.cardNumber}</div>
              
              <div className="text-muted-foreground">Pemegang:</div>
              <div>{card.userName}</div>
              
              <div className="text-muted-foreground">Jenis Kartu:</div>
              <div>{card.cardTypeName}</div>
              
              <div className="text-muted-foreground">Status:</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  card.status.toLowerCase() === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : card.status.toLowerCase() === 'expired'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {card.status}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-red-600 font-medium">
            ⚠️ Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen.
          </p>
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
                Ya, Hapus
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}