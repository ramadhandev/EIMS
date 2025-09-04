import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan Sistem</h2>
        <p className="text-gray-500">
          Kelola pengaturan dan konfigurasi sistem HSE Management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nama Perusahaan</Label>
              <Input id="company-name" defaultValue="PT Contoh Perusahaan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-admin">Email Administrator</Label>
              <Input id="email-admin" defaultValue="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" defaultValue="+62 21 12345678" />
            </div>
            <Button>Simpan Pengaturan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif" className="flex-1">
                Notifikasi Email
              </Label>
              <Switch id="email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="permit-notif" className="flex-1">
                Notifikasi Permit Baru
              </Label>
              <Switch id="permit-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="incident-notif" className="flex-1">
                Notifikasi Insiden
              </Label>
              <Switch id="incident-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="expiry-notif" className="flex-1">
                Notifikasi Masa Expired
              </Label>
              <Switch id="expiry-notif" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Keamanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor" className="flex-1">
                Two-Factor Authentication
              </Label>
              <Switch id="two-factor" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password-expiry" className="flex-1">
                Expire Password (90 hari)
              </Label>
              <Switch id="password-expiry" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="session-timeout" className="flex-1">
                Session Timeout (30 menit)
              </Label>
              <Switch id="session-timeout" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Terakhir Backup</Label>
              <p className="text-sm text-gray-500">15 Oktober 2023, 14:30</p>
            </div>
            <div className="space-y-2">
              <Label>Frekuensi Backup</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Harian</option>
                <option>Mingguan</option>
                <option>Bulanan</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Backup Sekarang</Button>
              <Button variant="outline">Restore</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}