"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ModerationTable } from "@/components/moderation/ModerationTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react";
import { mockAPI } from "@/lib/mock";
import { type Prediction, type Label, type Video } from "@/lib/types";
import { toast } from "sonner";

export default function ModerationPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string>("all");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("all");
  const [confidenceRange, setConfidenceRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [showOverridden, setShowOverridden] = useState<string>("all");

  const fetchPredictions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await mockAPI.getPredictions({
        label: selectedLabel === "all" ? undefined : (selectedLabel as Label),
        confidence: [confidenceRange[0] / 100, confidenceRange[1] / 100],
        videoId: selectedVideoId === "all" ? undefined : selectedVideoId,
        page: currentPage,
        limit: 10,
      });

      let filteredPredictions = result.predictions;

      // Apply override filter
      if (showOverridden === "only") {
        filteredPredictions = filteredPredictions.filter((p) => p.isOverridden);
      } else if (showOverridden === "none") {
        filteredPredictions = filteredPredictions.filter(
          (p) => !p.isOverridden
        );
      }

      setPredictions(filteredPredictions);
      setTotalPages(Math.ceil(result.total / 10));
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast.error("Gagal memuat data prediksi");
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedLabel,
    selectedVideoId,
    confidenceRange,
    currentPage,
    showOverridden,
  ]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await mockAPI.getVideos();
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const handleOverride = async (predictionId: string, label: Label) => {
    try {
      await mockAPI.overridePrediction(predictionId, label);
      await fetchPredictions(); // Refresh data
    } catch (error) {
      console.error("Error overriding prediction:", error);
      toast.error("Gagal mengubah prediksi");
    }
  };

  const handleArchive = async (_predictionId: string) => {
    // Mock archive functionality
    toast.success("Prediksi berhasil diarsipkan");
    await fetchPredictions();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLabel("all");
    setSelectedVideoId("all");
    setConfidenceRange([0, 100]);
    setShowOverridden("all");
    setCurrentPage(1);
  };

  const pendingCount = predictions.filter((p) => !p.isOverridden).length;
  const overriddenCount = predictions.filter((p) => p.isOverridden).length;
  const highConfidenceCount = predictions.filter(
    (p) => p.confidence >= 0.8
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Moderation Queue"
        description="Tinjau dan validasi hasil prediksi model AI"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchPredictions}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Prediksi</p>
                <p className="text-2xl font-bold">{predictions.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-green-600">
                  {overriddenCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Confidence</p>
                <p className="text-2xl font-bold text-blue-600">
                  {highConfidenceCount}
                </p>
              </div>
              <Badge variant="secondary">≥80%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Cari Komentar:
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari teks komentar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Label Filter */}
            <div className="space-y-2">
              <label htmlFor="label-filter" className="text-sm font-medium">
                Filter Label:
              </label>
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger id="label-filter">
                  <SelectValue placeholder="Pilih label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Label</SelectItem>
                  <SelectItem value="bullying">Bullying</SelectItem>
                  <SelectItem value="non_bullying">Non-Bullying</SelectItem>
                  <SelectItem value="ambiguous">Ragu-ragu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Filter */}
            <div className="space-y-2">
              <label htmlFor="video-filter" className="text-sm font-medium">
                Filter Video:
              </label>
              <Select
                value={selectedVideoId}
                onValueChange={setSelectedVideoId}
              >
                <SelectTrigger id="video-filter">
                  <SelectValue placeholder="Pilih video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Video</SelectItem>
                  {videos.map((video) => (
                    <SelectItem key={video.id} value={video.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{video.title}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {video.totalComments}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Override Status Filter */}
            <div className="space-y-2">
              <label htmlFor="override-filter" className="text-sm font-medium">
                Status Review:
              </label>
              <Select value={showOverridden} onValueChange={setShowOverridden}>
                <SelectTrigger id="override-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="none">Belum Direview</SelectItem>
                  <SelectItem value="only">Sudah Direview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Confidence Range Slider */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Range Confidence: {confidenceRange[0]}% - {confidenceRange[1]}%
            </label>
            <div className="px-2">
              <Slider
                value={confidenceRange}
                onValueChange={(value) =>
                  setConfidenceRange(value as [number, number])
                }
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline">
                {predictions.length} prediksi ditemukan
              </Badge>
            </div>
            <Button variant="ghost" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Prediksi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>Tidak ada prediksi yang sesuai dengan filter</p>
            </div>
          ) : (
            <>
              <ModerationTable
                predictions={predictions}
                onOverride={handleOverride}
                onArchive={handleArchive}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            currentPage > 1 && setCurrentPage(currentPage - 1)
                          }
                          className={
                            currentPage <= 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      {totalPages > 5 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            currentPage < totalPages &&
                            setCurrentPage(currentPage + 1)
                          }
                          className={
                            currentPage >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
