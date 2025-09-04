import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/lib/utils/permit.ts
export const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    case "draft":
      return "outline";
    case "inprogress":
      return "default";
    case "completed":
      return "default";
    default:
      return "outline";
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "Disetujui";
    case "pending":
      return "Menunggu";
    case "rejected":
      return "Ditolak";
    case "draft":
      return "Draft";
    case "inprogress":
      return "Berjalan";
    case "completed":
      return "Selesai";
    default:
      return status;
  }
};

export const formatDateTime = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return dateString;
  }
};