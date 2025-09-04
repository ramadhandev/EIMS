
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
import CreateUserDialog from "./components/CreateUserDialog";
import UpdateUserDialog from "./components/UpdateUserDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";
import SearchAndFilter  from "./components/SearchAndFilter";
import Pagination from "./components/Pagination";
import { User, Filtere } from "@/types/user"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filtere>({
    role: "",
    status: "",
    department: "",
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      
    } catch (err: any) {
      console.error("Fetch users error:", err);
      alert(`Error fetching users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search term filter
      const matchesSearch = 
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = 
        !filters.role || 
        user.role.toLowerCase() === filters.role.toLowerCase();

      // Status filter
      const matchesStatus = 
        !filters.status || 
        user.status.toLowerCase() === filters.status.toLowerCase();

      // Department filter
      const matchesDepartment = 
        !filters.department || 
        user.department.toLowerCase().includes(filters.department.toLowerCase());

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
  }, [users, searchTerm, filters]);

  

  // Pagination logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);
  

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, itemsPerPage]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      role: "",
      status: "",
      department: "",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-gray-500">Kelola pengguna dan hak akses</p>
        </div>
        <CreateUserDialog/>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearAllFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredUsers.length} pengguna
          {(searchTerm || Object.values(filters).some(filter => filter)) && (
            <span className="ml-2">
              (difilter dari {users.length} total)
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
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Memuat data pengguna...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <p className="text-gray-500">
                {searchTerm || Object.values(filters).some(filter => filter)
                  ? "Tidak ada pengguna yang sesuai dengan kriteria pencarian"
                  : "Tidak ada data pengguna"
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
                      <th className="p-4 text-left font-medium">Nama</th>
                      <th className="p-4 text-left font-medium">Email</th>
                      <th className="p-4 text-left font-medium">Peran</th>
                      <th className="p-4 text-left font-medium">Departemen</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Tanggal Dibuat</th>
                      <th className="p-4 text-left font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.userId} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{user.userId}</td>
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.role}</td>
                        <td className="p-4">{user.department}</td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {new Date(user.createdAt).toLocaleDateString("id-ID")}
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
                                <UpdateUserDialog user={user} onUserUpdated={fetchUsers} />
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeleteUserDialog user={user} onUserDeleted={fetchUsers} />
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
                    totalItems={filteredUsers.length}
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