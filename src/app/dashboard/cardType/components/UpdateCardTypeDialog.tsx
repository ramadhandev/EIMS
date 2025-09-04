"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CardType {
  cardTypeId: number;
  name: string;
  description?: string;
}

interface Props {
  cardType: CardType;
  onUpdated: () => void; // callback untuk refresh data
}

export default function UpdateCardTypeDialog({ cardType, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(cardType.name);
  const [description, setDescription] = useState(cardType.description || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cardtype/${cardType.cardTypeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardTypeId: cardType.cardTypeId,
            name,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui CardType");
      }

      setOpen(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui CardType");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Jenis Kartu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama jenis kartu"
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi jenis kartu"
            />
          </div>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
