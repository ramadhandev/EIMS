
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, ClipboardList } from "lucide-react";
import { PermitRequirement } from "@/types/permit-requirement";
import { permitRequirementApi } from "@/lib/api/permit-requirements";
import CreatePermitRequirementDialog from "./components/CreatePermitRequirementDialog";
import UpdatePermitRequirementDialog from "./components/UpdatePermitRequirementDialog";
import DeletePermitRequirementDialog from "./components/DeletePermitRequirementDialog";

export default function PermitRequirementsPage() {
  const [permitRequirements, setPermitRequirements] = useState<PermitRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPermitRequirements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await permitRequirementApi.getAll();
      setPermitRequirements(data);
      
    } catch (err: any) {
      console.error("Failed to fetch permit requirements:", err);
      setError(err.message || "Gagal memuat data requirements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermitRequirements();
  }, []);

  // Filter permit requirements based on search term
  const filteredRequirements = permitRequirements.filter(req =>
    req.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.requiredCardTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.requiredTraining?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat data permit requirements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPermitRequirements} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Permit Requirements</h2>
          <p className="text-gray-500">
            Kelola persyaratan permit berdasarkan jenis pekerjaan
          </p>
        </div>
        <CreatePermitRequirementDialog onRequirementCreated={fetchPermitRequirements} />
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan jenis pekerjaan, kartu required, training..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredRequirements.length} permit requirements
          {searchTerm && (
            <span className="ml-2">
              (difilter dari {permitRequirements.length} total)
            </span>
          )}
        </p>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="h-7 text-xs"
          >
            Clear Pencarian
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permit Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          {permitRequirements.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-500">Belum ada permit requirements</p>
              <p className="text-sm text-gray-400">
                Mulai dengan menambahkan permit requirement pertama Anda
              </p>
            </div>
          ) : filteredRequirements.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">
                Tidak ada permit requirements yang sesuai dengan pencarian
              </p>
              <Button 
                onClick={() => setSearchTerm("")} 
                variant="outline" 
                className="mt-2"
              >
                Clear Pencarian
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">ID</th>
                    <th className="p-4 text-left font-medium">Jenis Pekerjaan</th>
                    <th className="p-4 text-left font-medium">Kartu Diperlukan</th>
                    <th className="p-4 text-left font-medium">Training Diperlukan</th>
                    <th className="p-4 text-left font-medium">Catatan</th>
                    <th className="p-4 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequirements.map((requirement) => (
                    <tr key={requirement.requirementId} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">#{requirement.requirementId}</td>
                      <td className="p-4 font-medium">{requirement.workType}</td>
                      <td className="p-4">
                        <Badge variant="outline">{requirement.requiredCardTypeName}</Badge>
                      </td>
                      <td className="p-4">
                        {requirement.requiredTraining || (
                          <span className="text-muted-foreground">Tidak ada</span>
                        )}
                      </td>
                      <td className="p-4">
                        {requirement.notes || (
                          <span className="text-muted-foreground">Tidak ada catatan</span>
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
                              <UpdatePermitRequirementDialog 
                                requirement={requirement} 
                                onRequirementUpdated={fetchPermitRequirements} 
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <DeletePermitRequirementDialog 
                                requirement={requirement} 
                                onRequirementDeleted={fetchPermitRequirements} 
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}