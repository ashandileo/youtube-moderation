"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Key,
  Settings as SettingsIcon,
  Users,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { type Settings, type User } from "@/lib/types";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    openAIApiKey: "",
    youtubeProjectId: "youtube-moderation-project",
    labelingOrder: "random",
    batchSize: 10,
    autoSave: true,
  });

  const [users] = useState<User[]>([
    {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      lastActive: "2024-01-15T16:00:00Z",
    },
    {
      id: "2",
      email: "annotator1@example.com",
      name: "Annotator One",
      role: "annotator",
      lastActive: "2024-01-15T15:30:00Z",
    },
    {
      id: "3",
      email: "reviewer@example.com",
      name: "Reviewer",
      role: "reviewer",
      lastActive: "2024-01-15T14:45:00Z",
    },
  ]);

  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage for demo
      localStorage.setItem("moderationSettings", JSON.stringify(settings));

      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    key: keyof Settings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "reviewer":
        return "secondary";
      case "annotator":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "reviewer":
        return "Reviewer";
      case "annotator":
        return "Annotator";
      default:
        return role;
    }
  };

  const maskedApiKey = settings.openAIApiKey
    ? settings.openAIApiKey.slice(0, 8) +
      "..." +
      settings.openAIApiKey.slice(-4)
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi API, preferensi labeling, dan manajemen pengguna"
      >
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* API Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Integrasi API
            </CardTitle>
            <CardDescription>
              Konfigurasi API key untuk layanan eksternal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={settings.openAIApiKey}
                    onChange={(e) =>
                      handleInputChange("openAIApiKey", e.target.value)
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {settings.openAIApiKey && (
                <p className="text-xs text-muted-foreground">
                  Current key:{" "}
                  {showApiKey ? settings.openAIApiKey : maskedApiKey}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube-project">YouTube Project ID</Label>
              <Input
                id="youtube-project"
                value={settings.youtubeProjectId}
                onChange={(e) =>
                  handleInputChange("youtubeProjectId", e.target.value)
                }
                placeholder="youtube-moderation-project"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Project ID ini digunakan untuk integrasi dengan YouTube API
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Info:</strong> API key disimpan dengan enkripsi dan
                tidak akan dibagikan ke pihak ketiga.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Labeling Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Preferensi Labeling
            </CardTitle>
            <CardDescription>
              Pengaturan untuk proses anotasi dan labeling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="labeling-order">Urutan Komentar</Label>
              <Select
                value={settings.labelingOrder}
                onValueChange={(value) =>
                  handleInputChange(
                    "labelingOrder",
                    value as "random" | "newest"
                  )
                }
              >
                <SelectTrigger id="labeling-order">
                  <SelectValue placeholder="Pilih urutan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random (Acak)</SelectItem>
                  <SelectItem value="newest">Newest First (Terbaru)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-size">Batch Size</Label>
              <Select
                value={settings.batchSize.toString()}
                onValueChange={(value) =>
                  handleInputChange("batchSize", parseInt(value))
                }
              >
                <SelectTrigger id="batch-size">
                  <SelectValue placeholder="Pilih batch size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 komentar</SelectItem>
                  <SelectItem value="10">10 komentar</SelectItem>
                  <SelectItem value="20">20 komentar</SelectItem>
                  <SelectItem value="50">50 komentar</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Jumlah komentar yang dimuat per sesi anotasi
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Save</Label>
                <p className="text-xs text-muted-foreground">
                  Simpan otomatis setiap label yang dibuat
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) =>
                  handleInputChange("autoSave", checked)
                }
              />
            </div>

            <div className="p-3 bg-gray-50 border rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Target harian:</span>
                  <span className="font-medium">50 komentar</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi waktu:</span>
                  <span className="font-medium">~30 menit</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manajemen Pengguna
          </CardTitle>
          <CardDescription>
            Daftar pengguna sistem dan peran mereka
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleText(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.lastActive).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Untuk menambah atau menghapus pengguna, hubungi administrator
              sistem
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
          <CardDescription>
            Detail tentang versi dan konfigurasi sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Versi Aplikasi</h4>
              <p className="text-sm text-muted-foreground">v1.0.0-beta</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Model Version</h4>
              <p className="text-sm text-muted-foreground">
                bullying-detector-v1.2.0
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Database</h4>
              <p className="text-sm text-muted-foreground">PostgreSQL 14.x</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Last Update</h4>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button - Sticky */}
      <div className="sticky bottom-4 flex justify-center">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          size="lg"
          className="shadow-lg"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
        </Button>
      </div>
    </div>
  );
}
