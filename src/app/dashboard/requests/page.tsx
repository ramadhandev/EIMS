// app/approvals/page.tsx
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
import { MoreVertical, Search } from "lucide-react";
import ApproveRejectModal from "./components/ApproveRejectModal";
import UpdateApprovalDialog from "./components/UpdateApprovalDialog";
import DeleteApprovalDialog from "./components/DeleteApprovalDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Pagination from "./components/Pagination";
import { Approval, ApprovalFilters } from "@/types/approval";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ApprovalFilters>({
    role: "",
    decision: "",
    approver: "",
  });

  // State untuk modal
  const [modalState, setModalState] = useState({
    open: false,
    action: "approve" as "approve" | "reject" | "pending",
    approvalId: 0,
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchApprovals = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/approvals/with-permit`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setApprovals(data);
    
  } catch (err: any) {
    console.error("Fetch approvals error:", err);
    alert(`Error fetching approvals: ${err.message}`);
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  // Filter approvals based on search term and filters
  const filteredApprovals = useMemo(() => {
    return approvals.filter(approval => {
      // Search term filter
      const matchesSearch = 
        !searchTerm ||
        approval.approverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.decision.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.permitId.toString().includes(searchTerm) ||
        approval.approvalId.toString().includes(searchTerm);

      // Role filter
      const matchesRole = 
        !filters.role || 
        approval.role.toLowerCase() === filters.role.toLowerCase();

      // Decision filter
      const matchesDecision = 
        !filters.decision || 
        approval.decision.toLowerCase() === filters.decision.toLowerCase();

      return matchesSearch && matchesRole && matchesDecision;
    });
  }, [approvals, searchTerm, filters]);

  // Pagination logic
  const paginatedApprovals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApprovals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApprovals, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, itemsPerPage]);

  const getDecisionVariant = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      role: "",
      decision: "",
      approver: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const openModal = (action: "approve" | "reject" | "pending", approvalId: number) => {
    setModalState({
      open: true,
      action,
      approvalId,
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      action: "approve",
      approvalId: 0,
    });
  };

  // Format tanggal untuk display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "-";
    }
  };
  
  // Get unique roles and decisions for filter options
  const roleOptions = Array.from(new Set(approvals.map(a => a.role)));
  const decisionOptions = ["Pending", "Approved", "Rejected"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Persetujuan</h2>
          <p className="text-gray-500">Kelola persetujuan permit dan dokumen</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search Input */}
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="search">Cari</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari persetujuan, permit, penyetuju..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <Label htmlFor="role">Peran</Label>
              <Select
                value={filters.role || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, role: value === "all" ? "" : value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Semua peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua peran</SelectItem>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Decision Filter */}
            <div className="space-y-2">
              <Label htmlFor="decision">Keputusan</Label>
              <Select
                value={filters.decision || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, decision: value === "all" ? "" : value })
                }
              >
                <SelectTrigger id="decision">
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  {decisionOptions.map((decision) => (
                    <SelectItem key={decision} value={decision.toLowerCase()}>
                      {decision}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="space-y-2 flex items-end">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredApprovals.length} persetujuan
          {(searchTerm || Object.values(filters).some(filter => filter)) && (
            <span className="ml-2">
              (difilter dari {approvals.length} total)
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
          <CardTitle>Daftar Persetujuan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Memuat data persetujuan...</p>
            </div>
          ) : filteredApprovals.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <p className="text-gray-500">
                {searchTerm || Object.values(filters).some(filter => filter)
                  ? "Tidak ada persetujuan yang sesuai dengan kriteria pencarian"
                  : "Tidak ada data persetujuan"
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
                      <th className="p-4 text-left font-medium">ID Permit</th>
                      <th className="p-4 text-left font-medium">Penyetuju</th>
                      <th className="p-4 text-left font-medium">Peran</th>
                      <th className="p-4 text-left font-medium">Keputusan</th>
                      <th className="p-4 text-left font-medium">Komentar</th>
                      <th className="p-4 text-left font-medium">Tanggal Keputusan</th>
                      <th className="p-4 text-left font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedApprovals.map((approval) => (
                      <tr key={approval.approvalId} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{approval.approvalId}</td>
                        <td className="p-4">{approval.permitId}</td>
                        <td className="p-4">{approval.approverName}</td>
                        <td className="p-4">{approval.role}</td>
                        <td className="p-4">
                          <Badge variant={getDecisionVariant(approval.decision)}>
                            {approval.decision}
                          </Badge>
                        </td>
                        <td className="p-4 max-w-xs truncate">{approval.comment || "-"}</td>
                        <td className="p-4">
                          {formatDate(approval.decisionDate)}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                           
                            <DropdownMenuContent align="end" className="w-48">
                              {/* Quick Actions */}
                              <DropdownMenuItem 
                                onClick={() => openModal("approve", approval.approvalId)}
                              >
                                <span>Setujui</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openModal("reject", approval.approvalId)}
                              >
                                <span className="text-red-600">Tolak</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openModal("pending", approval.approvalId)}
                              >
                                <span className="text-blue-600">Set Pending</span>
                              </DropdownMenuItem>

                              {/* Edit (untuk perubahan detail) */}
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UpdateApprovalDialog approval={approval} onApprovalUpdated={fetchApprovals}>
                                  <span>Edit Status</span>
                                </UpdateApprovalDialog>
                              </DropdownMenuItem>

                              {/* Hapus */}
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeleteApprovalDialog approval={approval} onApprovalDeleted={fetchApprovals}>
                                  <span className="text-red-600">Hapus</span>
                                </DeleteApprovalDialog>
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
                    totalItems={filteredApprovals.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal untuk Approve/Reject/Pending */}
      <ApproveRejectModal
        open={modalState.open}
        onOpenChange={closeModal}
        action={modalState.action}
        approvalId={modalState.approvalId}
        onSuccess={fetchApprovals}
      />
    </div>
  );
}