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
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Database,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Define types for menu items
interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },

  { name: "Kartu HSE", href: "/dashboard/hsecards", icon: CreditCard },
  { name: "Pelatihan", href: "/dashboard/trainings", icon: BookOpen },
  { name: "Permit Kerja", href: "/dashboard/permits", icon: FileText },
  { name: "Laporan Insiden", href: "/dashboard/incidents", icon: AlertTriangle },
  { name: "Investigation", href: "/dashboard/investigation", icon: CheckSquare },
  { name: "Dokumen", href: "/dashboard/documents", icon: File },
  { name: "Requests", href: "/dashboard/requests", icon: FileText },
  { name: "Pengguna", href: "/dashboard/users", icon: Users },
    { 
    name: "Data Master", 
    href: "#", 
    icon: Database,
    children: [
      { name: "Permit Requirement", href: "/dashboard/permit-requirement", icon: ClipboardList },
      { name: "Card Type", href: "/dashboard/cardType", icon: CreditCard },
      { name: "Dokumen Requirement", href: "/dashboard/document-requirement", icon: File },
    ]
  },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  // Check if a path is active including child paths
  const isActiveParent = (item: MenuItem) => {
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

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
            const hasChildren = item.children && item.children.length > 0;
            const isActive = pathname === item.href;
            const isParentActive = isActiveParent(item);
            const isDropdownOpen = openDropdown === item.name;
            
            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        "flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                        (isActive || isParentActive) && "bg-blue-100 text-blue-600 font-medium"
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                      {isDropdownOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {isDropdownOpen && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = pathname === child.href;
                          
                          return (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors",
                                  isChildActive && "bg-blue-100 text-blue-600 font-medium"
                                )}
                              >
                                <ChildIcon className="w-4 h-4 mr-2" />
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
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
                )}
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