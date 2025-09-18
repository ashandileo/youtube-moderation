"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AnnotationCard } from "@/components/annotation/AnnotationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Kbd } from "@/components/common/kbd";
import {
  Target,
  HelpCircle,
  PlayCircle,
  Keyboard,
  BarChart3,
} from "lucide-react";
import { mockAPI } from "@/lib/mock";
import { type Comment, type Label, type Video } from "@/lib/types";
import { toast } from "sonner";

export default function AnnotatePage() {
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ labeled: 0, total: 1000 });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await mockAPI.getVideos();
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Gagal memuat daftar video");
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    loadNextComment();
  }, [selectedVideoId]);

  const loadNextComment = useCallback(async () => {
    setIsLoading(true);
    try {
      const comment = await mockAPI.getNextComment(
        selectedVideoId === "all" ? undefined : selectedVideoId
      );
      setCurrentComment(comment);
    } catch (error) {
      console.error("Error loading comment:", error);
      toast.error("Tidak ada lagi komentar yang tersedia");
      setCurrentComment(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVideoId]);

  const handleLabel = async (label: Label) => {
    if (!currentComment) return;

    try {
      await mockAPI.labelComment(currentComment.id, label);

      // Update progress
      setProgress((prev) => ({ ...prev, labeled: prev.labeled + 1 }));

      toast.success(`Komentar berhasil dilabel sebagai "${label}"`);

      // Load next comment
      loadNextComment();
    } catch (error) {
      console.error("Error labeling comment:", error);
      toast.error("Gagal menyimpan label");
    }
  };

  const handleSkip = () => {
    toast.info("Komentar dilewati");
    loadNextComment();
  };

  const progressPercentage = Math.round(
    (progress.labeled / progress.total) * 100
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anotasi Komentar"
        description="Berikan label pada komentar YouTube untuk melatih model AI"
      >
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/analytics")}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Lihat Progress
        </Button>
      </PageHeader>

      {/* Controls Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pengaturan Anotasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="video-select" className="text-sm font-medium">
                Filter Video:
              </label>
              <Select
                value={selectedVideoId}
                onValueChange={setSelectedVideoId}
              >
                <SelectTrigger id="video-select" className="w-64">
                  <SelectValue placeholder="Pilih video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Video</SelectItem>
                  {videos.map((video) => (
                    <SelectItem key={video.id} value={video.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{video.title}</span>
                        <Badge variant="secondary" className="ml-2">
                          {video.totalComments}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">
                Mode: Random Sampling
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress Anotasi</span>
              <span>
                {progress.labeled} / {progress.total} komentar
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {progressPercentage}% complete • Target harian: 50 komentar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Annotation Card - Left Side */}
        <div className="lg:col-span-2">
          <AnnotationCard
            comment={currentComment}
            onLabel={handleLabel}
            onSkip={handleSkip}
            isLoading={isLoading}
          />
        </div>

        {/* Helper Panel - Right Side */}
        <div className="space-y-4">
          {/* Label Definitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Definisi Label
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500">Bullying</Badge>
                  <Kbd>1</Kbd>
                </div>
                <p className="text-muted-foreground">
                  Komentar yang mengandung pelecehan, intimidasi, ujaran
                  kebencian, atau serangan personal terhadap individu atau
                  kelompok.
                </p>
                <p className="text-xs font-medium">Contoh:</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>&quot;Kamu bodoh banget&quot;</li>
                  <li>&quot;Dasar sampah masyarakat&quot;</li>
                  <li>Serangan berdasarkan ras, agama, gender</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">Non-Bullying</Badge>
                  <Kbd>2</Kbd>
                </div>
                <p className="text-muted-foreground">
                  Komentar normal, konstruktif, netral, atau positif yang tidak
                  mengandung unsur pelecehan.
                </p>
                <p className="text-xs font-medium">Contoh:</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>&quot;Bagus videonya&quot;</li>
                  <li>&quot;Terima kasih informasinya&quot;</li>
                  <li>Kritik yang membangun</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">Ragu-ragu</Badge>
                  <Kbd>3</Kbd>
                </div>
                <p className="text-muted-foreground">
                  Komentar yang tidak jelas, ambigu, atau sulit dikategorikan
                  sebagai bullying atau non-bullying.
                </p>
                <p className="text-xs font-medium">Contoh:</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>Sarkasme yang tidak jelas</li>
                  <li>Komentar dengan konteks kurang</li>
                  <li>Bahasa gaul yang ambigu</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Shortcut Keyboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Label Bullying</span>
                <Kbd>1</Kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Label Non-Bullying</span>
                <Kbd>2</Kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Label Ragu-ragu</span>
                <Kbd>3</Kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Lewati Komentar</span>
                <Kbd>S</Kbd>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Tips Anotasi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Baca komentar dengan teliti</li>
                <li>Pertimbangkan konteks dan niat</li>
                <li>Gunakan label &quot;Ragu-ragu&quot; jika tidak yakin</li>
                <li>Konsisten dalam penilaian</li>
                <li>Istirahat jika merasa lelah</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
