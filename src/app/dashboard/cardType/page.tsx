"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";

// TODO: bikin dialog create, update, delete (nanti mirip dengan HSECardsPage)
import CreateCardTypeDialog from "./components/CreateCardTypeDialog";
import UpdateCardTypeDialog from "./components/UpdateCardTypeDialog";
import DeleteCardTypeDialog from "./components/DeleteCardTypeDialog";

interface CardType {
  cardTypeId: number;
  name: string;
  description?: string;
}

export default function CardTypePage() {
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCardTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cardtype`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CardType[] = await response.json();
      setCardTypes(data);

    } catch (err: any) {
      setError(err.message || "Gagal memuat data CardType");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardTypes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat data CardType...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCardTypes} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Jenis Kartu</h2>
          <p className="text-gray-500">Kelola jenis kartu HSE</p>
        </div>
        <CreateCardTypeDialog onCreated={fetchCardTypes} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Jenis Kartu ({cardTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cardTypes.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Tidak ada data jenis kartu</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">ID</th>
                    <th className="p-4 text-left font-medium">Nama</th>
                    <th className="p-4 text-left font-medium">Deskripsi</th>
                    <th className="p-4 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cardTypes.map((type) => (
                    <tr key={type.cardTypeId} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{type.cardTypeId}</td>
                      <td className="p-4">{type.name}</td>
                      <td className="p-4">{type.description || "-"}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <UpdateCardTypeDialog cardType={type} onUpdated={fetchCardTypes} />
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <DeleteCardTypeDialog cardType={type} onDeleted={fetchCardTypes} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
