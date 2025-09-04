"use client";

import { useState, useEffect } from "react";
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
import { Edit, Loader2 } from "lucide-react";
import { User, UserUpdate } from "@/types/user";

interface UpdateUserDialogProps {
  user: User;
  onUserUpdated: () => void;
}

export default function UpdateUserDialog({ user, onUserUpdated }: UpdateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    status: "",
  });

  const [errors, setErrors] = useState<Partial<UserUpdate>>({});

  // Initialize form data when user changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        department: user.department || "",
        password: "", // Password dikosongkan karena optional
        status: user.status || "Active",
      });
      setErrors({});
    }
  }, [user, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserUpdate> = {};

    // Validasi Name: MaxLength(100) - Optional
    if (formData.name && formData.name.length > 100) {
      newErrors.name = "Nama maksimal 100 karakter";
    }

    // Validasi Email: EmailAddress + MaxLength(100) - Optional
    if (formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Format email tidak valid";
      } else if (formData.email.length > 100) {
        newErrors.email = "Email maksimal 100 karakter";
      }
    }

    // Validasi Password: MinLength(6) - Optional
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Validasi Department: MaxLength(50) - Optional
    if (formData.department && formData.department.length > 50) {
      newErrors.department = "Departemen maksimal 50 karakter";
    }

    // Validasi Status: MaxLength(10) - Optional
    if (formData.status && formData.status.length > 10) {
      newErrors.status = "Status maksimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Hanya kirim field yang diubah (tidak undefined atau empty string)
      const updateData: UserUpdate = {};
      
      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.role !== user.role) updateData.role = formData.role;
      if (formData.department !== user.department) updateData.department = formData.department;
      if (formData.status !== user.status) updateData.status = formData.status;
      if (formData.password) updateData.password = formData.password; // Hanya jika diisi

      // Jika tidak ada yang diubah, tidak perlu kirim request
      if (Object.keys(updateData).length === 0) {
        setOpen(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengupdate pengguna");
      }

      setOpen(false);
      onUserUpdated(); // Panggil callback untuk refresh data
      
    } catch (error: any) {
      console.error("Update user error:", error);
      alert(error.message || "Gagal mengupdate pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserUpdate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error ketika user mulai mengetik
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full cursor-pointer justify-start text-green-600 hover:text-green-700 hover:bg-green-50">
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Edit informasi pengguna {user.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - Optional + MaxLength(100) */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
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

          {/* Email - Optional + Email + MaxLength(100) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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

          {/* Password - Optional + MinLength(6) */}
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role - Optional */}
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Supervisor">Superviosr</SelectItem>
                <SelectItem value="HSE">HSE</SelectItem>
                <SelectItem value="Worker">Worker</SelectItem>
            
              </SelectContent>
            </Select>
          </div>

          {/* Department - Optional + MaxLength(50) */}
          <div className="space-y-2">
            <Label htmlFor="department">Departemen</Label>
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

          {/* Status - Optional + MaxLength(10) */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}