"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Search, Filter, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateIncidentDialog from "./components/CreateIncidentDialog";
import UpdateIncidentDialog from "./components/UpdateIncidentDialog";
import DeleteIncidentDialog from "./components/DeleteIncidentDialog";
import ViewIncidentDialog from "./components/ViewIncidentDialog";
import { Incident } from "@/types/incident";
import InvestigationStatusBadge from "./components/InvestigationStatusBadge";

export default function IncidentsPage() {
  const [investigationLoading, setInvestigationLoading] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);

 const fetchIncidents = async () => {
  try {
    setLoading(true);
    setInvestigationLoading(true);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidentreport`);
    if (!res.ok) throw new Error("Gagal mengambil data insiden");
    const data = await res.json();
    
    // Fetch investigation details untuk setiap insiden
    const incidentsWithInvestigation = await Promise.all(
      data.map(async (incident: any) => {
        try {
          const investigationRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/investigation/incident/${incident.incidentId}`
          );
          
          if (investigationRes.ok) {
            const investigationData = await investigationRes.json();
            return {
              ...incident,
              investigation: {
                rootCause: investigationData.rootCause,
                correctiveAction: investigationData.correctiveAction,
                preventiveAction: investigationData.preventiveAction,
                closeDate: investigationData.closeDate
              }
            };
          }
          return incident;
        } catch (error) {
          console.error("Error fetching investigation:", error);
          return incident;
        }
      })
    );
    
    setIncidents(incidentsWithInvestigation);
    setInvestigationLoading(false);
    
  } catch (err) {
    console.error(err);
    setInvestigationLoading(false);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchIncidents();
  }, []);

 

 const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "reported":
        return "secondary";
      case "investigating":
        return "default";
      case "in progress":
        return "default";
      case "resolved":
        return "success";
      case "closed":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Laporan Insiden</h2>
          <p className="text-gray-500">Kelola laporan insiden dan investigasi</p>
        </div>
        <CreateIncidentDialog onCreated={fetchIncidents} />
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari laporan insiden..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Laporan Insiden</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
               <thead>
  <tr className="border-b bg-muted/50"> 
    <th className="p-4 text-left font-medium">Pelapor</th>
    <th className="p-4 text-left font-medium">Tanggal</th>
    <th className="p-4 text-left font-medium">Lokasi</th>
    <th className="p-4 text-left font-medium">Kategori</th>
    <th className="p-4 text-left font-medium">Status</th> 
    <th className="p-4 text-left font-medium">Status Investigasi</th>
    <th className="p-4 text-left font-medium">Aksi</th>
  </tr>
</thead>
              <tbody>
  {incidents.map((incident) => (
    <tr key={incident.incidentId} className="border-b">
      <td className="p-4">{incident.userName}</td>
      <td className="p-4">
        {new Date(incident.date).toLocaleDateString("id-ID")}
      </td>
      <td className="p-4">{incident.location ?? "-"}</td>
      <td className="p-4">{incident.category}</td>
      
      {/* Kolom Status Insiden */}
      <td className="p-4">
        <Badge variant={getStatusVariant(incident.status)}>
          {incident.status}
        </Badge>
      </td>

      {/* KOLOM BARU: Status Investigasi */}
      <td className="p-4">
          <InvestigationStatusBadge incident={incident} />
      </td>

      {/* Kolom Aksi */}
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ViewIncidentDialog incident={incident} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UpdateIncidentDialog incident={incident} onUpdated={fetchIncidents} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteIncidentDialog incident={incident} onDeleted={fetchIncidents} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  ))}
  
  {incidents.length === 0 && (
    <tr>
      <td colSpan={8} className="text-center p-4 text-gray-500"> {/* Ubah menjadi 8 */}
        Tidak ada data insiden
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
