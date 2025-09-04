import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  BookOpen, 
  FileText, 
  AlertTriangle, 
  Users,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Kartu HSE",
      value: "245",
      icon: CreditCard,
      description: "+20 dari bulan lalu",
      trend: "up",
      change: "12%"
    },
    {
      title: "Pelatihan Aktif",
      value: "128",
      icon: BookOpen,
      description: "+12 dari bulan lalu",
      trend: "up",
      change: "8%"
    },
    {
      title: "Permit Diverifikasi",
      value: "45",
      icon: FileText,
      description: "5 menunggu persetujuan",
      trend: "neutral",
      change: "0%"
    },
    {
      title: "Insiden Dilaporkan",
      value: "8",
      icon: AlertTriangle,
      description: "-3 dari bulan lalu",
      trend: "down",
      change: "5%"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500">
          Ringkasan aktivitas HSE Management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUp : 
                           stat.trend === "down" ? ArrowDown : ArrowUp;
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center pt-1">
                  {stat.trend !== "neutral" && (
                    <TrendIcon className={`h-3 w-3 mr-1 ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`} />
                  )}
                  <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : 
                                      stat.trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Kartu HSE baru diterbitkan
                  </p>
                  <p className="text-sm text-gray-500">
                    Kartu APD untuk John Doe
                  </p>
                </div>
                <div className="ml-auto font-medium">2 jam lalu</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Permit kerja disetujui
                  </p>
                  <p className="text-sm text-gray-500">
                    Permit kerja untuk area konstruksi
                  </p>
                </div>
                <div className="ml-auto font-medium">5 jam lalu</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Laporan insiden baru
                  </p>
                  <p className="text-sm text-gray-500">
                    Insiden slip dan fall di area gudang
                  </p>
                </div>
                <div className="ml-auto font-medium">1 hari lalu</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pengguna Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="rounded-full h-9 w-9 bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Kontraktor</p>
                  <p className="text-sm text-gray-500">142 pengguna aktif</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full h-9 w-9 bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Karyawan</p>
                  <p className="text-sm text-gray-500">86 pengguna aktif</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full h-9 w-9 bg-yellow-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">HSE Officer</p>
                  <p className="text-sm text-gray-500">17 pengguna aktif</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}