"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, Calendar, MapPin, AlertCircle } from "lucide-react";
import { User } from "@/types/user";

interface CreateIncidentDialogProps {
  onCreated: () => void;
}

// Define category options
const CATEGORIES = [
  "Kecelakaan",
  "Kebakaran",
  "Keamanan",
  "Kesehatan",
  "Infrastruktur",
  "Lainnya"
];

export default function CreateIncidentDialog({ onCreated }: CreateIncidentDialogProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    userId: "",
    date: new Date().toISOString().slice(0, 16),
    location: "",
    category: "",
    description: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
    if (!res.ok) throw new Error("Gagal mengambil data pengguna");
    const data = await res.json();
    setUsers(data);
  } catch (err) {
    console.error("Gagal ambil users:", err);
    setErrors(prev => ({...prev, users: "Gagal memuat daftar pengguna"}));
  }
};

// Gunakan useCallback untuk prevent unnecessary re-renders
useEffect(() => {
  if (open) {
    fetchUsers();
    setErrors({});
    // Reset form
    setForm({
      userId: "",
      date: new Date().toISOString().slice(0, 16),
      location: "",
      category: "",
      description: ""
    });
    setPhoto(null);
    setPhotoPreview(null);
  }
}, [open]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({...prev, photo: "Ukuran file maksimal 5MB"}));
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({...prev, photo: "Hanya file JPEG, PNG, GIF, atau WebP yang diperbolehkan"}));
        return;
      }
      
      setPhoto(file);
      setErrors(prev => ({...prev, photo: ""}));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setErrors(prev => ({...prev, photo: ""}));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.userId) newErrors.userId = "Pelapor harus dipilih";
    if (!form.date) newErrors.date = "Tanggal harus diisi";
    if (!form.category) newErrors.category = "Kategori harus dipilih";
    if (photo && photo.size > 5 * 1024 * 1024) newErrors.photo = "Ukuran file maksimal 5MB";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    setLoading(true);
    setErrors({});
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("userId", form.userId);
    formData.append("date", new Date(form.date).toISOString());
    formData.append("location", form.location);
    formData.append("category", form.category);
    formData.append("description", form.description);
    
    if (photo) {
      formData.append("photo", photo);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/incidentreport`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Gagal membuat laporan insiden");
    }

    const result = await response.json();
    
    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      setForm({
        userId: "",
        date: new Date().toISOString().slice(0, 16),
        location: "",
        category: "",
        description: ""
      });
      setPhoto(null);
      setPhotoPreview(null);
      onCreated();
    }, 1000);
    
  } catch (err: any) {
    console.error("Error creating incident:", err);
    setErrors(prev => ({
      ...prev, 
      submit: err.message || "Terjadi kesalahan saat membuat laporan insiden"
    }));
  } finally {
    setLoading(false);
  }
};

  const isFormValid = form.userId && form.date && form.category;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Buat Laporan Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Buat Laporan Insiden Baru
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column - Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId" className="flex items-center gap-1 mb-1">
                <span>Pelapor</span>
                <span className="text-red-500">*</span>
              </Label>
              <select
                id="userId"
                className={`w-full border rounded-md p-2.5 ${errors.userId ? 'border-red-500' : 'border-gray-300'}`}
                value={form.userId}
                onChange={(e) => {
                  setForm({ ...form, userId: e.target.value });
                  setErrors(prev => ({...prev, userId: ""}));
                }}
              >
                <option value="">Pilih Pelapor</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.name}
                  </option>
                ))}
              </select>
              {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
            </div>

            <div>
              <Label htmlFor="date" className="flex items-center gap-1 mb-1">
                <Calendar className="h-4 w-4" />
                <span>Tanggal & Waktu Kejadian</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="datetime-local"
                value={form.date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value });
                  setErrors(prev => ({...prev, date: ""}));
                }}
                
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-1 mb-1">
                <MapPin className="h-4 w-4" />
                <span>Lokasi Kejadian</span>
              </Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Masukkan lokasi kejadian"
              />
            </div>

            <div>
              <Label htmlFor="category" className="flex items-center gap-1 mb-1">
                <AlertCircle className="h-4 w-4" />
                <span>Kategori Insiden</span>
                <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                className={`w-full border rounded-md p-2.5 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                value={form.category}
                onChange={(e) => {
                  setForm({ ...form, category: e.target.value });
                  setErrors(prev => ({...prev, category: ""}));
                }}
              >
                <option value="">Pilih Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Right Column - Description and Photo */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="mb-1">Deskripsi Insiden</Label>
              <textarea
                id="description"
                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[120px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Jelaskan detail insiden yang terjadi..."
              />
            </div>

            <div>
              <Label htmlFor="photo" className="mb-1">Upload Bukti Foto</Label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${errors.photo ? 'border-red-500' : 'border-gray-300'}`}>
                <div className="space-y-1 text-center w-full">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="mx-auto max-h-48 max-w-full object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-2 truncate">{photo?.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex flex-col text-sm text-gray-600">
                        <label
                          htmlFor="photo"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Klik untuk upload</span>
                          <input
                            id="photo"
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handlePhotoChange}
                          />
                        </label>
                        <p className="mt-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP (maks. 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
              {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            type="button"
            disabled={loading}
          >
            Batal
          </Button>
        <Button 
  onClick={handleSubmit} 
  disabled={loading || !isFormValid}
  className="min-w-[120px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Menyimpan...
    </>
  ) : success ? (
    "Berhasil!"
  ) : (
    "Simpan Laporan"
  )}
</Button>
        </div>
      </DialogContent>
      
{success && (
  <div className="bg-green-50 border border-green-200 rounded-md p-3">
    <p className="text-green-700 text-sm">Laporan insiden berhasil dibuat!</p>
  </div>
)}

{errors.submit && (
  <div className="bg-red-50 border border-red-200 rounded-md p-3">
    <p className="text-red-700 text-sm">{errors.submit}</p>
  </div>
)}
    </Dialog>
  );
}