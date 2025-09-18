"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  Target,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { mockAPI } from "@/lib/mock";
import { type ModelMetrics, type ErrorSample } from "@/lib/types";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [errorSamples, setErrorSamples] = useState<ErrorSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [metricsData, errorsData] = await Promise.all([
          mockAPI.getModelMetrics(),
          mockAPI.getErrorSamples(),
        ]);
        setMetrics(metricsData);
        setErrorSamples(errorsData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    const [metricsData, errorsData] = await Promise.all([
      mockAPI.getModelMetrics(),
      mockAPI.getErrorSamples(),
    ]);
    setMetrics(metricsData);
    setErrorSamples(errorsData);
    setIsLoading(false);
  };

  const getMetricColor = (value: number) => {
    if (value >= 0.8) return "text-green-600";
    if (value >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricBadgeVariant = (value: number) => {
    if (value >= 0.8) return "default";
    if (value >= 0.6) return "secondary";
    return "destructive";
  };

  const getLabelText = (label: string) => {
    switch (label) {
      case "bullying":
        return "Bullying";
      case "non_bullying":
        return "Non-Bullying";
      case "ambiguous":
        return "Ragu-ragu";
      default:
        return label;
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Model Analytics"
          description="Analisis performa dan metrik model prediksi"
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Analytics"
        description="Analisis performa dan metrik model prediksi"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </PageHeader>

      {/* Metrics Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getMetricColor(metrics.accuracy)}>
                {(metrics.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Prediksi benar secara keseluruhan
            </p>
            <Badge
              variant={getMetricBadgeVariant(metrics.accuracy)}
              className="mt-2"
            >
              {metrics.accuracy >= 0.8
                ? "Excellent"
                : metrics.accuracy >= 0.6
                ? "Good"
                : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precision</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getMetricColor(metrics.precision)}>
                {(metrics.precision * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Prediksi positif yang benar
            </p>
            <Badge
              variant={getMetricBadgeVariant(metrics.precision)}
              className="mt-2"
            >
              {metrics.precision >= 0.8
                ? "High"
                : metrics.precision >= 0.6
                ? "Medium"
                : "Low"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recall</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getMetricColor(metrics.recall)}>
                {(metrics.recall * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Kasus positif yang terdeteksi
            </p>
            <Badge
              variant={getMetricBadgeVariant(metrics.recall)}
              className="mt-2"
            >
              {metrics.recall >= 0.8
                ? "High"
                : metrics.recall >= 0.6
                ? "Medium"
                : "Low"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getMetricColor(metrics.f1Score)}>
                {(metrics.f1Score * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Harmonic mean precision & recall
            </p>
            <Badge
              variant={getMetricBadgeVariant(metrics.f1Score)}
              className="mt-2"
            >
              Overall Score
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="confusion" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi</TabsTrigger>
          <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="confusion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix</CardTitle>
              <CardDescription>
                Matriks perbandingan prediksi vs label aktual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div></div>
                <div className="text-center font-medium text-sm">
                  Predicted Bullying
                </div>
                <div className="text-center font-medium text-sm">
                  Predicted Non-Bullying
                </div>

                <div className="text-center font-medium text-sm">
                  Actual Bullying
                </div>
                <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {metrics.confusionMatrix.trueBullying}
                    </div>
                    <div className="text-xs text-green-600">True Positive</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">
                      {metrics.confusionMatrix.falseNonBullying}
                    </div>
                    <div className="text-xs text-red-600">False Negative</div>
                  </div>
                </div>

                <div className="text-center font-medium text-sm">
                  Actual Non-Bullying
                </div>
                <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">
                      {metrics.confusionMatrix.falseBullying}
                    </div>
                    <div className="text-xs text-red-600">False Positive</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {metrics.confusionMatrix.trueNonBullying}
                    </div>
                    <div className="text-xs text-green-600">True Negative</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">Total Samples</div>
                  <div className="text-2xl font-bold">
                    {Object.values(metrics.confusionMatrix).reduce(
                      (a, b) => a + b,
                      0
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium">Accuracy Rate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Label Distribution</CardTitle>
              <CardDescription>
                Distribusi prediksi berdasarkan kategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  📊 Chart placeholder - implementasi chart library dapat
                  ditambahkan di sini
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">45%</div>
                    <div className="text-sm text-muted-foreground">
                      Bullying
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-muted-foreground">
                      Non-Bullying
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      15%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ambiguous
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error Analysis
              </CardTitle>
              <CardDescription>
                Analisis kesalahan prediksi untuk improvement model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Komentar</TableHead>
                    <TableHead>Label Benar</TableHead>
                    <TableHead>Prediksi Model</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorSamples.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">{error.comment}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            error.trueLabel === "bullying"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {getLabelText(error.trueLabel)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            error.predictedLabel === "bullying"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {getLabelText(error.predictedLabel)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={getMetricColor(error.confidence)}>
                          {(error.confidence * 100).toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Tren performa model dari waktu ke waktu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                📈 Trend chart placeholder - dapat diimplementasi dengan chart
                library
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Improvement This Week</div>
                  <div className="text-2xl font-bold text-green-600">+2.3%</div>
                  <div className="text-sm text-muted-foreground">
                    F1 Score increase
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Total Predictions</div>
                  <div className="text-2xl font-bold">15,420</div>
                  <div className="text-sm text-muted-foreground">
                    This month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
