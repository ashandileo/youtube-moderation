"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Video,
  MessageSquare,
  Tag,
  Calendar,
  User,
  Play,
  ExternalLink,
} from "lucide-react";
import { mockAPI } from "@/lib/mock";
import { type Video as VideoType, type Comment } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [videoComments, setVideoComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await mockAPI.getVideos();
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Gagal memuat daftar video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoSelect = async (video: VideoType) => {
    setSelectedVideo(video);
    setIsLoadingComments(true);
    try {
      const comments = await mockAPI.getVideoComments(video.id);
      setVideoComments(comments);
    } catch (error) {
      console.error("Error fetching video comments:", error);
      toast.error("Gagal memuat komentar video");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const getProgressPercentage = (labeled: number, total: number) => {
    return Math.round((labeled / total) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Video Explorer"
          description="Jelajahi video YouTube dan kelola komentar per video"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
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
        title="Video Explorer"
        description="Jelajahi video YouTube dan kelola komentar per video"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Video</p>
                <p className="text-2xl font-bold">{videos.length}</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Komentar</p>
                <p className="text-2xl font-bold">
                  {videos
                    .reduce((sum, video) => sum + video.totalComments, 0)
                    .toLocaleString()}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sudah Dilabel</p>
                <p className="text-2xl font-bold">
                  {videos
                    .reduce((sum, video) => sum + video.labeledComments, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Tag className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    videos.reduce(
                      (sum, video) =>
                        sum +
                        getProgressPercentage(
                          video.labeledComments,
                          video.totalComments
                        ),
                      0
                    ) / videos.length
                  )}
                  %
                </p>
              </div>
              <Badge variant="secondary">Labeling</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const progressPercentage = getProgressPercentage(
            video.labeledComments,
            video.totalComments
          );

          return (
            <Drawer key={video.id}>
              <DrawerTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Thumbnail */}
                    <div className="relative mb-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover rounded border bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/320x180/f3f4f6/9ca3af?text=Video+Thumbnail";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/75 text-white"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                          {video.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {video.channelTitle}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{video.totalComments} komentar</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(video.publishedAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span>Progress Labeling</span>
                          <span className="font-medium">
                            {progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(
                              progressPercentage
                            )}`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{video.labeledComments} berlabel</span>
                          <span>
                            {video.totalComments - video.labeledComments} belum
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DrawerTrigger>

              <DrawerContent>
                <div className="mx-auto w-full max-w-4xl">
                  <DrawerHeader>
                    <DrawerTitle>{video.title}</DrawerTitle>
                    <DrawerDescription>
                      Detail video dan komentar terbaru
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="p-4 pb-0">
                    <div className="space-y-6">
                      {/* Video Details */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium">Informasi Video</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{video.channelTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(video.publishedAt).toLocaleDateString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              <span>{video.totalComments} total komentar</span>
                            </div>
                          </div>
                          {video.description && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {video.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Statistik Labeling</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Progress</span>
                              <Badge variant="outline">
                                {progressPercentage}% complete
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${getProgressColor(
                                  progressPercentage
                                )}`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="font-bold text-green-700">
                                  {video.labeledComments}
                                </div>
                                <div className="text-green-600">Berlabel</div>
                              </div>
                              <div className="text-center p-2 bg-orange-50 rounded">
                                <div className="font-bold text-orange-700">
                                  {video.totalComments - video.labeledComments}
                                </div>
                                <div className="text-orange-600">Belum</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/annotate?video=${video.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Mulai Anotasi Video Ini
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="#" target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Lihat di YouTube
                          </Link>
                        </Button>
                      </div>

                      {/* Recent Comments */}
                      <div className="space-y-3">
                        <h4 className="font-medium">
                          Komentar Terbaru (5 terakhir)
                        </h4>
                        {isLoadingComments ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                          </div>
                        ) : videoComments.length > 0 ? (
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Komentar</TableHead>
                                  <TableHead>Author</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {videoComments.map((comment) => (
                                  <TableRow key={comment.id}>
                                    <TableCell className="max-w-xs">
                                      <p className="text-sm line-clamp-2">
                                        {comment.text}
                                      </p>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {comment.author}
                                    </TableCell>
                                    <TableCell>
                                      {comment.humanLabel ? (
                                        <Badge variant="default">
                                          {comment.humanLabel}
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">
                                          Belum berlabel
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Tidak ada komentar ditemukan
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground pt-6">
        <p>Klik pada kartu video untuk melihat detail dan mulai anotasi</p>
      </div>
    </div>
  );
}
