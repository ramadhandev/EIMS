
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
import { Plus, Search, MoreVertical, FileText } from "lucide-react";
import { DocumentRequirement } from "@/types/document-requirement";
import { documentRequirementApi } from "@/lib/api/document-requirements";
import CreateDocumentRequirementDialog from "./components/CreateDocumentRequirementDialog";
import UpdateDocumentRequirementDialog from "./components/UpdateDocumentRequirementDialog";
import DeleteDocumentRequirementDialog from "./components/DeleteDocumentRequirementDialog";

export default function DocumentRequirementsPage() {
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocumentRequirements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await documentRequirementApi.getAll();
      setDocumentRequirements(data);
      
    } catch (err: any) {
      console.error("Failed to fetch document requirements:", err);
      setError(err.message || "Gagal memuat data requirements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentRequirements();
  }, []);

  // Filter document requirements based on search term
  const filteredRequirements = documentRequirements.filter(req =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat data document requirements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchDocumentRequirements} variant="outline">
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
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Document Requirements</h2>
          <p className="text-gray-500">
            Kelola persyaratan dokumen untuk permit kerja
          </p>
        </div>
        <CreateDocumentRequirementDialog onRequirementCreated={fetchDocumentRequirements} />
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari document requirement..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredRequirements.length} document requirements
          {searchTerm && (
            <span className="ml-2">
              (difilter dari {documentRequirements.length} total)
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
          <CardTitle>Daftar Document Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          {documentRequirements.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-500">Belum ada document requirements</p>
              <p className="text-sm text-gray-400">
                Mulai dengan menambahkan document requirement pertama Anda
              </p>
            </div>
          ) : filteredRequirements.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">
                Tidak ada document requirements yang sesuai dengan pencarian
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
                    
                    <th className="p-4 text-left font-medium">Nama</th>
                    <th className="p-4 text-left font-medium">Deskripsi</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequirements.map((requirement) => (
                    <tr key={requirement.documentRequirementId} className="border-b hover:bg-muted/50">
                      
                      <td className="p-4">{requirement.name}</td>
                      <td className="p-4">
                        {requirement.description || (
                          <span className="text-muted-foreground">Tidak ada deskripsi</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">Active</Badge>
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
                              <UpdateDocumentRequirementDialog 
                                requirement={requirement} 
                                onRequirementUpdated={fetchDocumentRequirements} 
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <DeleteDocumentRequirementDialog 
                                requirement={requirement} 
                                onRequirementDeleted={fetchDocumentRequirements} 
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