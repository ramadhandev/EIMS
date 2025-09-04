// D:\Project_api\leash\eims-app\src\app\dashboard\users\components\CreateUserDialog.tsx
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { UserCreate } from "@/types/user";

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserCreate>({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const [errors, setErrors] = useState<Partial<UserCreate>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserCreate> = {};

    // Validasi Name: Required + MaxLength(100)
    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (formData.name.length > 100) {
      newErrors.name = "Nama maksimal 100 karakter";
    }

    // Validasi Email: Required + EmailAddress + MaxLength(100)
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email maksimal 100 karakter";
    }

    // Validasi Password: Required + MinLength(6)
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Validasi Role: Required
    if (!formData.role) {
      newErrors.role = "Peran wajib dipilih";
    }

    // Validasi Department: Required + MaxLength(50)
    if (!formData.department.trim()) {
      newErrors.department = "Departemen wajib diisi";
    } else if (formData.department.length > 50) {
      newErrors.department = "Departemen maksimal 50 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "Active" // Default status dari backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat pengguna");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        department: "",
      });
      
      setOpen(false);
      window.location.reload(); // Refresh untuk update data
      
    } catch (error: any) {
      console.error("Create user error:", error);
      alert(error.message || "Gagal membuat pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserCreate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error ketika user mulai mengetik
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk menambahkan pengguna baru ke sistem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - Required + MaxLength(100) */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nama lengkap (maks. 100 karakter)"
              maxLength={100}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email - Required + Email + MaxLength(100) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email@contoh.com (maks. 100 karakter)"
              maxLength={100}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password - Required + MinLength(6) */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role - Required */}
          <div className="space-y-2">
            <Label htmlFor="role">Peran *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="HSE">HSE</SelectItem>
                <SelectItem value="Worker">Worker</SelectItem>
                
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Department - Required + MaxLength(50) */}
          <div className="space-y-2">
            <Label htmlFor="department">Departemen *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Nama departemen (maks. 50 karakter)"
              maxLength={50}
              disabled={loading}
            />
            {errors.department && (
              <p className="text-sm text-red-500">{errors.department}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}