// D:\Project_api\leash\eims-app\src\app\dashboard\users\components\DeleteUserDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { User } from "@/types/user";

interface DeleteUserDialogProps {
  user: User;
  onUserDeleted: () => void;
}

export default function DeleteUserDialog({ user, onUserDeleted }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log("Deleting user with ID:", user.userId);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = "Gagal menghapus pengguna";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      setOpen(false);
      onUserDeleted(); // Refresh data
      console.log("User deleted successfully");
      
    } catch (error: any) {
      console.error("Delete user error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-red-600 hover:text-red-700 cursor-pointer hover:bg-red-50"
          onClick={(e) => e.stopPropagation()} // Prevent dropdown close
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Hapus Pengguna</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pengguna ini?
            <br />
            <span className="font-semibold">{user.name} ({user.email})</span>
            <br />
            <span className="text-red-500 text-sm">Tindakan ini tidak dapat dibatalkan.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-3 rounded-md text-sm">
          <p className="font-medium mb-2">Detail Pengguna:</p>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-muted-foreground">ID:</span>
            <span>{user.userId}</span>
            <span className="text-muted-foreground">Peran:</span>
            <span>{user.role}</span>
            <span className="text-muted-foreground">Departemen:</span>
            <span>{user.department}</span>
            <span className="text-muted-foreground">Status:</span>
            <span>{user.status}</span>
          </div>
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
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}