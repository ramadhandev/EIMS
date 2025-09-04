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

import CreateTrainingDialog from "./components/CreateTrainingDialog";
import UpdateTrainingDialog from "./components/UpdateTrainingDialog";
import DeleteTrainingDialog from "./components/DeleteTrainingDialog";

interface Training {
  trainingId: number;
  userId: number;
  userName: string;
  trainingName: string;
  completionDate: string;
  expiryDate: string;
  certificateURL?: string;
  status: string;
  notes?: string;
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainings`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: Training[] = await response.json();
      setTrainings(data);
    } catch (err: any) {
      console.error("Failed to fetch trainings:", err);
      setError(err.message || "Gagal memuat data pelatihan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const isExpired = (expiryDate: string) => {
    try {
      return new Date(expiryDate) < new Date();
    } catch {
      return false;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "expired":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat data pelatihan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchTrainings} variant="outline">Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pelatihan</h2>
          <p className="text-gray-500">Kelola pelatihan dan sertifikasi karyawan</p>
        </div>
        <CreateTrainingDialog onCreated={fetchTrainings} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelatihan ({trainings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {trainings.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Tidak ada data pelatihan</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Karyawan</th>
                    <th className="p-4 text-left font-medium">Nama Pelatihan</th>
                    <th className="p-4 text-left font-medium">Tanggal Selesai</th>
                    <th className="p-4 text-left font-medium">Tanggal Expired</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Sertifikat</th>
                    <th className="p-4 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map((t) => {
                    const expired = isExpired(t.expiryDate);
                    const displayStatus = expired ? "expired" : t.status;

                    return (
                      <tr key={t.trainingId} className="border-b hover:bg-muted/50">
                        <td className="p-4">{t.userName}</td>
                        <td className="p-4">{t.trainingName}</td>
                        <td className="p-4">{formatDate(t.completionDate)}</td>
                        <td className="p-4">
                          <span className={expired ? "text-red-600 font-medium" : ""}>
                            {formatDate(t.expiryDate)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(displayStatus)}>
                            {displayStatus}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {t.certificateURL ? (
                            <a
                              href={t.certificateURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Lihat Sertifikat
                            </a>
                          ) : (
                            "-"
                          )}
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
                                <UpdateTrainingDialog training={t} onUpdated={fetchTrainings} />
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeleteTrainingDialog training={t} onDeleted={fetchTrainings} />
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
