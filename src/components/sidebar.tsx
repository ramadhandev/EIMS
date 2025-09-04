"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  CreditCard, 
  BookOpen, 
  FileText, 
  Users, 
  AlertTriangle, 
  ClipboardList, 
  Settings,
  File,
  CheckSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Kartu HSE", href: "/dashboard/hsecards", icon: CreditCard },
  { name: "Pelatihan", href: "/dashboard/trainings", icon: BookOpen },
  { name: "Permit Kerja", href: "/dashboard/permits", icon: FileText },
  { name: "Permit Requirement", href: "/dashboard/permit-requirement", icon: ClipboardList },
  { name: "Laporan Insiden", href: "/dashboard/incidents", icon: AlertTriangle },
  { name: "Investigation", href: "/dashboard/investigation", icon: CheckSquare },
  { name: "Dokumen", href: "/dashboard/documents", icon: File },
  { name: "Dokumen Requirement", href: "/dashboard/document-requirement", icon: ClipboardList },
  { name: "Requests", href: "/dashboard/requests", icon: FileText },
  { name: "Pengguna", href: "/dashboard/users", icon: Users },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">HSE Management</h1>
        <p className="text-sm text-gray-500">Sistem Manajemen K3</p>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                    isActive && "bg-blue-100 text-blue-600 font-medium"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="rounded-full h-10 w-10 bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}