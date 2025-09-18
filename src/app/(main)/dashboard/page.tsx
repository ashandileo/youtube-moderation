"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Tag,
  AlertTriangle,
  TrendingUp,
  Clock,
  Play,
  Shield,
} from "lucide-react";
import { mockAPI } from "@/lib/mock";
import { type KPIData, type ActivityLog } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  console.log("masuk");
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpi, logs] = await Promise.all([
          mockAPI.getKPIData(),
          mockAPI.getActivityLogs(),
        ]);
        setKpiData(kpi);
        setActivityLogs(logs);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "annotation":
        return <Tag className="h-4 w-4 text-blue-600" />;
      case "moderation":
        return <Shield className="h-4 w-4 text-green-600" />;
      case "import":
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case "export":
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case "annotation":
        return "default";
      case "moderation":
        return "secondary";
      case "import":
        return "outline";
      case "export":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Ringkasan statistik dan aktivitas sistem moderasi"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!kpiData) return null;

  const labeledPercentage = Math.round((kpiData.labeled / kpiData.total) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan statistik dan aktivitas sistem moderasi"
      >
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/annotate">
              <Play className="mr-2 h-4 w-4" />
              Mulai Anotasi
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/moderation">
              <Shield className="mr-2 h-4 w-4" />
              Lihat Moderasi
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Komentar
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiData.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua komentar dalam dataset
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Komentar Terlabel
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiData.labeled.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {labeledPercentage}% dari total komentar
            </p>
            <Progress value={labeledPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prediksi Bullying (24h)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {kpiData.bullying24h}
            </div>
            <p className="text-xs text-muted-foreground">
              Komentar terdeteksi dalam 24 jam terakhir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              F1 Score Model
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(kpiData.lastModelF1 * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Performa model terakhir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Activity and Dataset Summary */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Aktivitas Terbaru</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan Dataset</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Aktivitas</CardTitle>
              <CardDescription>
                Aktivitas terbaru dari pengguna sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aktivitas</TableHead>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tipe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="flex items-center gap-2">
                        {getActivityIcon(log.type)}
                        {log.message}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActivityBadgeVariant(log.type)}>
                          {log.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Labeling</CardTitle>
                <CardDescription>
                  Kemajuan proses pelabelan manual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Berlabel</span>
                    <span>{kpiData.labeled.toLocaleString()}</span>
                  </div>
                  <Progress value={labeledPercentage} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Belum Berlabel</span>
                    <span>
                      {(kpiData.total - kpiData.labeled).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={100 - labeledPercentage} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>
                  Metrik performa model prediksi terbaru
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">F1 Score</span>
                  <Badge variant="secondary">
                    {(kpiData.lastModelF1 * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bullying Detected (24h)</span>
                  <Badge variant="destructive">{kpiData.bullying24h}</Badge>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Lihat Detail Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
