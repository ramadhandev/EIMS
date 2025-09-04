"use client";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
} from "@/components/ui/dropdown-menu";
import { PermitDetailDialog } from "./components/permit-detail-dialog";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import { PermitDetail } from "@/types/permit";
import { permitApi } from "@/lib/api/permit";
import { PermitCreateForm } from "./components/permit-create-form";
import DeletePermitDialog from "./components/DeletePermitDialog";
import Pagination from "./components/Pagination";

export default function PermitsPage() {
  const [permits, setPermits] = useState<PermitDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedPermit, setSelectedPermit] = useState<PermitDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permittowork`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PermitDetail[] = await response.json();
      setPermits(data);
      
    } catch (err: any) {
      console.error("Failed to fetch permits:", err);
      setError(err.message || "Gagal memuat data permit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  // Filter permits based on search term and filters
  const filteredPermits = useMemo(() => {
    return permits.filter(permit => {
      const matchesSearch = 
        permit.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.requiredCardTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || permit.status.toLowerCase() === statusFilter;
      
      const matchesDate = dateFilter === "all" || 
        (dateFilter === "today" && new Date(permit.startDate).toDateString() === new Date().toDateString()) ||
        (dateFilter === "upcoming" && new Date(permit.startDate) > new Date());
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [permits, searchTerm, statusFilter, dateFilter]);

  // Pagination logic
  const paginatedPermits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPermits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPermits, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Fungsi untuk handle aksi
  const handleApprove = async (permitId: number) => {
    try {
      await permitApi.approvePermit(permitId);
      fetchPermits();
    } catch (error) {
      console.error("Gagal approve permit:", error);
      setError("Gagal approve permit");
    }
  };

  const handleReject = async (permitId: number) => {
    try {
      const reason = prompt("Alasan penolakan:");
      if (reason) {
        await permitApi.rejectPermit(permitId, reason);
        fetchPermits();
      }
    } catch (error) {
      console.error("Gagal reject permit:", error);
      setError("Gagal reject permit");
    }
  };

  const handleViewDetail = (permit: PermitDetail) => {
    setSelectedPermit(permit);
    setDetailOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      case "draft":
        return "outline";
      case "inprogress":
        return "default";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      case "draft":
        return "Draft";
      case "inprogress":
        return "Berjalan";
      case "completed":
        return "Selesai";
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

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start.toDateString() === end.toDateString()) {
        return formatDate(startDate);
      }
      
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } catch {
      return `${startDate} - ${endDate}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Memuat data permit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPermits} variant="outline">
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
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Permit Kerja</h2>
          <p className="text-gray-500">
            Kelola permit to work dan persetujuan
          </p>
        </div>
        <PermitCreateForm onSuccess={fetchPermits} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari permit berdasarkan nama, jenis pekerjaan, lokasi..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              Semua Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
              Menunggu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
              Disetujui
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
              Ditolak
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter Tanggal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDateFilter("all")}>
              Semua Tanggal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("today")}>
              Hari Ini
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("upcoming")}>
              Mendatang
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredPermits.length} permit
          {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
            <span className="ml-2">
              (difilter dari {permits.length} total)
            </span>
          )}
        </p>
        {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDateFilter("all");
            }}
            className="h-7 text-xs"
          >
            Clear semua filter
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Daftar Permit Kerja ({filteredPermits.length})
            {searchTerm && (
              <span className="text-sm text-muted-foreground font-normal ml-2">
                (difilter dari {permits.length} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {permits.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Tidak ada data permit</p>
            </div>
          ) : filteredPermits.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Tidak ada permit yang sesuai dengan pencarian</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }} 
                variant="outline" 
                className="mt-2"
              >
                Clear Pencarian
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">ID Permit</th>
                      <th className="p-4 text-left font-medium">Pemohon</th>
                      <th className="p-4 text-left font-medium">Jenis Pekerjaan</th>
                      <th className="p-4 text-left font-medium">Lokasi</th>
                      <th className="p-4 text-left font-medium">Tanggal</th>
                      <th className="p-4 text-left font-medium">Kartu Diperlukan</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Dibuat</th>
                      <th className="p-4 text-left font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPermits.map((permit) => (
                      <tr key={permit.permitId} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">PTW-{permit.permitId.toString().padStart(4, '0')}</td>
                        <td className="p-4">{permit.userName}</td>
                        <td className="p-4">{permit.workType}</td>
                        <td className="p-4">{permit.location || "-"}</td>
                        <td className="p-4">{formatDateRange(permit.startDate, permit.endDate)}</td>
                        <td className="p-4">{permit.requiredCardTypeName || "Tidak ada"}</td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(permit.status)}>
                            {getStatusText(permit.status)}
                          </Badge>
                          {permit.autoApproved && (
                            <span className="text-xs text-muted-foreground block mt-1">
                              Auto-approve
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDateTime(permit.createdAt)}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewDetail(permit)}>
                                Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeletePermitDialog permit={permit} onPermitDeleted={fetchPermits} />
                              </DropdownMenuItem>
                              {permit.status === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApprove(permit.permitId)}>
                                    Setujui
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReject(permit.permitId)}>
                                    Tolak
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredPermits.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <PermitDetailDialog 
        permit={selectedPermit}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}