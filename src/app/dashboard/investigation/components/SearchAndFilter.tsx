"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InvestigationFilters } from "@/types/investigation";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: InvestigationFilters;
  onFiltersChange: (filters: InvestigationFilters) => void;
  onClearFilters: () => void;
  filterOptions: {
    hseOfficerOptions: { value: string; label: string }[];
    statusOptions: { value: string; label: string }[];
  };
}

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
  filterOptions,
}: SearchAndFilterProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Cari</Label>
            <Input
              id="search"
              placeholder="Cari penyebab, tindakan, atau petugas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* HSE Officer Filter */}
          <div className="space-y-2">
            <Label htmlFor="hseOfficer">Petugas HSE</Label>
            <Select
              value={filters.hseOfficerId}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, hseOfficerId: value })
              }
            >
              <SelectTrigger id="hseOfficer">
                <SelectValue placeholder="Semua petugas" />
              </SelectTrigger>
              <SelectContent>
                
                {filterOptions.hseOfficerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
            
                {filterOptions.statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <div className="space-y-2 flex items-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              Clear Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}