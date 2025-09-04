"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import CreateInvestigationDialog from "./components/CreateInvestigationDialog";
import UpdateInvestigationDialog from "./components/UpdateInvestigationDialog";
import DeleteInvestigationDialog from "./components/DeleteInvestigationDialog";
import SearchAndFilter from "./components/SearchAndFilter";
import Pagination from "./components/Pagination";
import { Investigation, InvestigationFilters } from "@/types/investigation";

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<InvestigationFilters>({
    hseOfficerId: "",
    status: "",
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchInvestigations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investigation`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInvestigations(data);
      
    } catch (err: any) {
      console.error("Fetch investigations error:", err);
      alert(`Error fetching investigations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  // Filter investigations based on search term and filters
  const filteredInvestigations = useMemo(() => {
    return investigations.filter(investigation => {
      // Search term filter
      const matchesSearch = 
        !searchTerm ||
        investigation.rootCause?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investigation.correctiveAction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investigation.preventiveAction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investigation.hseOfficerName.toLowerCase().includes(searchTerm.toLowerCase());

      // HSE Officer filter
      const matchesHseOfficer = 
        !filters.hseOfficerId || 
        investigation.hseOfficerId.toString() === filters.hseOfficerId;

      // Status filter (open/closed based on closeDate)
      const matchesStatus = 
        !filters.status || 
        (filters.status === "open" && !investigation.closeDate) ||
        (filters.status === "closed" && investigation.closeDate);

      return matchesSearch && matchesHseOfficer && matchesStatus;
    });
  }, [investigations, searchTerm, filters]);

  // Pagination logic
  const paginatedInvestigations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvestigations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvestigations, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredInvestigations.length / itemsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, itemsPerPage]);

  const getStatusVariant = (closeDate: Date | null | undefined) => {
    return closeDate ? "success" : "secondary";
  };

  const getStatusText = (closeDate: Date | null | undefined) => {
    return closeDate ? "Closed" : "Open";
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      hseOfficerId: "",
      status: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleCloseInvestigation = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investigation/${id}/close`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the list
      fetchInvestigations();
    } catch (err: any) {
      console.error("Close investigation error:", err);
      alert(`Error closing investigation: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Investigasi</h2>
          <p className="text-gray-500">Kelola investigasi insiden</p>
        </div>
        <CreateInvestigationDialog onInvestigationCreated={fetchInvestigations} />
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearAllFilters}
        filterOptions={{
          hseOfficerOptions: Array.from(new Set(investigations.map(i => i.hseOfficerId))).map(id => ({
            value: id.toString(),
            label: investigations.find(i => i.hseOfficerId === id)?.hseOfficerName || `Officer ${id}`
          })),
          statusOptions: [
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" }
          ]
        }}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredInvestigations.length} investigasi
          {(searchTerm || Object.values(filters).some(filter => filter)) && (
            <span className="ml-2">
              (difilter dari {investigations.length} total)
            </span>
          )}
        </p>
        {(searchTerm || Object.values(filters).some(filter => filter)) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs"
          >
            Clear semua filter
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Investigasi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Memuat data investigasi...</p>
            </div>
          ) : filteredInvestigations.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <p className="text-gray-500">
                {searchTerm || Object.values(filters).some(filter => filter)
                  ? "Tidak ada investigasi yang sesuai dengan kriteria pencarian"
                  : "Tidak ada data investigasi"
                }
              </p>
              {(searchTerm || Object.values(filters).some(filter => filter)) && (
                <Button onClick={clearAllFilters} variant="outline">
                  Clear Filter
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">ID</th>
                      <th className="p-4 text-left font-medium">ID Insiden</th>
                      <th className="p-4 text-left font-medium">Petugas HSE</th>
                      <th className="p-4 text-left font-medium">Penyebab Utama</th>
                      <th className="p-4 text-left font-medium">Tindakan Korektif</th>
                      <th className="p-4 text-left font-medium">Tindakan Preventif</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Tanggal Ditutup</th>
                      <th className="p-4 text-left font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvestigations.map((investigation) => (
                      <tr key={investigation.investigationId} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{investigation.investigationId}</td>
                        <td className="p-4">{investigation.incidentId}</td>
                        <td className="p-4">{investigation.hseOfficerName}</td>
                        <td className="p-4 max-w-xs truncate">{investigation.rootCause || "-"}</td>
                        <td className="p-4 max-w-xs truncate">{investigation.correctiveAction || "-"}</td>
                        <td className="p-4 max-w-xs truncate">{investigation.preventiveAction || "-"}</td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(investigation.closeDate)}>
                            {getStatusText(investigation.closeDate)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {investigation.closeDate 
                            ? new Date(investigation.closeDate).toLocaleDateString("id-ID")
                            : "-"
                          }
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UpdateInvestigationDialog 
                                  investigation={investigation} 
                                  onInvestigationUpdated={fetchInvestigations} 
                                />
                              </DropdownMenuItem>
                              {!investigation.closeDate && (
                                <DropdownMenuItem 
                                  onClick={() => handleCloseInvestigation(investigation.investigationId)}
                                >
                                  Tutup Investigasi
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeleteInvestigationDialog 
                                  investigation={investigation} 
                                  onInvestigationDeleted={fetchInvestigations} 
                                />
                              </DropdownMenuItem>
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
                <div className="border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredInvestigations.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}