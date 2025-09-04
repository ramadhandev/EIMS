// D:\Project_api\leash\eims-app\src\app\dashboard\users\components\SearchAndFilter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Filtere } from "@/types/user";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: Filtere;
  onFiltersChange: (filters: Filtere) => void;
  onClearFilters: () => void;
}

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: keyof Filtere, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = filters.role !== "" || filters.status !== "" || filters.department !== "";

  const clearAllFilters = () => {
    onFiltersChange({
      role: "",
      status: "",
      department: "",
    });
    onClearFilters();
  };

  const clearSingleFilter = (filterKey: keyof Filtere) => {
    handleFilterChange(filterKey, "");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari pengguna berdasarkan nama, email, peran, atau departemen..."
            className="pl-9 pr-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0">
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filter Pengguna</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-role">Peran</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Peran</SelectItem>
                    <SelectItem value="Superviosr">Supervisor</SelectItem>
                    <SelectItem value="HSE">HSE</SelectItem>
                    <SelectItem value="Worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <Button
                onClick={() => setIsFilterOpen(false)}
                className="w-full"
              >
                Terapkan Filter
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter aktif:</span>
          
          {filters.role !== "" && filters.role !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Peran: {filters.role}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => clearSingleFilter("role")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.status !== "" && filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => clearSingleFilter("status")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.department !== "" && filters.department !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Dept: {filters.department}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => clearSingleFilter("department")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}