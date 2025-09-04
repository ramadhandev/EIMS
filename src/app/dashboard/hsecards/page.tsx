
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
import CreateCardDialog from "./components/CreateCardDialog";
import UpdateCardDialog from "./components/UpdateCardDialog";
import DeleteCardDialog from "./components/DeleteCardDialog";

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

export default function HSECardsPage() {
  const [cards, setCards] = useState<HSECard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hsecards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HSECard[] = await response.json();
      setCards(data);
      
    } catch (err: any) {
      console.error("Failed to fetch HSE cards:", err);
      setError(err.message || "Gagal memuat data kartu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "pending":
        return "secondary";
      case "revoked":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Aktif";
      case "expired":
        return "Kadaluarsa";
      case "pending":
        return "Menunggu";
      case "revoked":
        return "Ditarik";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const isExpired = (expiredDate: string) => {
    try {
      return new Date(expiredDate) < new Date();
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat data kartu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCards} variant="outline">
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
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Kartu HSE</h2>
          <p className="text-gray-500">
            Kelola kartu HSE karyawan dan kontraktor
          </p>
        </div>
        <CreateCardDialog onCardCreated={fetchCards} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kartu HSE ({cards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Tidak ada data kartu</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">No. Kartu</th>
                    <th className="p-4 text-left font-medium">Pemegang</th>
                    <th className="p-4 text-left font-medium">Jenis Kartu</th>
                    <th className="p-4 text-left font-medium">Diterbitkan Oleh</th>
                    <th className="p-4 text-left font-medium">Tanggal Terbit</th>
                    <th className="p-4 text-left font-medium">Tanggal Expired</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => {
                    const isCardExpired = isExpired(card.expiredDate);
                    const displayStatus = isCardExpired ? "expired" : card.status.toLowerCase();
                    
                    return (
                      <tr key={card.cardId} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{card.cardNumber}</td>
                        <td className="p-4">{card.userName}</td>
                        <td className="p-4">{card.cardTypeName}</td>
                        <td className="p-4">{card.issuedByName}</td>
                        <td className="p-4">{formatDate(card.issuedDate)}</td>
                        <td className="p-4">
                          <span className={isCardExpired ? "text-red-600 font-medium" : ""}>
                            {formatDate(card.expiredDate)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(displayStatus)}>
                            {getStatusText(displayStatus)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UpdateCardDialog card={card} onCardUpdated={fetchCards} />
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeleteCardDialog card={card} onCardDeleted={fetchCards} />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}