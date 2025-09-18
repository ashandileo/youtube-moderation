"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MoreHorizontal,
  Eye,
  Flag,
  Archive,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { type Prediction, type Label } from "@/lib/types";
import { getCommentById } from "@/lib/mock";
import { toast } from "sonner";

interface ModerationTableProps {
  predictions: Prediction[];
  onOverride: (predictionId: string, label: Label) => void;
  onArchive: (predictionId: string) => void;
}

export function ModerationTable({
  predictions,
  onOverride,
  onArchive,
}: ModerationTableProps) {
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const getLabelBadgeVariant = (label: Label, confidence: number) => {
    if (confidence < 0.5) return "outline";

    switch (label) {
      case "bullying":
        return "destructive";
      case "non_bullying":
        return "secondary";
      case "ambiguous":
        return "default";
      default:
        return "outline";
    }
  };

  const getLabelText = (label: Label) => {
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const handleViewDetail = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setIsDetailDialogOpen(true);
  };

  const handleOverride = (prediction: Prediction, newLabel: Label) => {
    onOverride(prediction.id, newLabel);
    toast.success(`Prediksi diubah menjadi "${getLabelText(newLabel)}"`);
    setIsDetailDialogOpen(false);
  };

  const handleArchive = (prediction: Prediction) => {
    onArchive(prediction.id);
    toast.success("Prediksi telah diarsipkan");
    setIsDetailDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDetailComment = (commentId: string) => {
    return getCommentById(commentId);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Komentar</TableHead>
              <TableHead>Prediksi</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction) => {
              const comment = getDetailComment(prediction.commentId);
              return (
                <TableRow key={prediction.id}>
                  <TableCell className="max-w-md">
                    <div className="space-y-1">
                      <p className="text-sm line-clamp-2">
                        {comment?.text || "Komentar tidak ditemukan"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          oleh {comment?.author}
                        </span>
                        {comment?.likeCount !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {comment.likeCount} likes
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getLabelBadgeVariant(
                        prediction.label,
                        prediction.confidence
                      )}
                    >
                      {getLabelText(prediction.label)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span
                        className={`font-medium ${getConfidenceColor(
                          prediction.confidence
                        )}`}
                      >
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                      <Progress
                        value={prediction.confidence * 100}
                        className="w-16 h-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {prediction.modelVersion}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(prediction.createdAt)}
                  </TableCell>
                  <TableCell>
                    {prediction.isOverridden ? (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Overridden
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewDetail(prediction)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOverride(prediction, "bullying")}
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          Tandai Bullying
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleOverride(prediction, "non_bullying")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Tandai Non-Bullying
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleArchive(prediction)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Arsip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Prediksi</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang prediksi dan komentar
            </DialogDescription>
          </DialogHeader>

          {selectedPrediction && (
            <div className="space-y-6">
              {/* Comment Text */}
              <div>
                <h4 className="text-sm font-medium mb-2">Komentar:</h4>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm leading-relaxed">
                    &ldquo;
                    {getDetailComment(selectedPrediction.commentId)?.text ||
                      "Tidak ditemukan"}
                    &rdquo;
                  </p>
                </div>
              </div>

              {/* Comment Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Author:</span>
                  <p className="text-muted-foreground">
                    {getDetailComment(selectedPrediction.commentId)?.author}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Published:</span>
                  <p className="text-muted-foreground">
                    {getDetailComment(selectedPrediction.commentId)
                      ?.publishedAt &&
                      formatDate(
                        getDetailComment(selectedPrediction.commentId)!
                          .publishedAt
                      )}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Prediction Details */}
              <div>
                <h4 className="text-sm font-medium mb-3">Detail Prediksi:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Label:</span>
                    <div className="mt-1">
                      <Badge
                        variant={getLabelBadgeVariant(
                          selectedPrediction.label,
                          selectedPrediction.confidence
                        )}
                      >
                        {getLabelText(selectedPrediction.label)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Confidence:</span>
                    <div className="mt-1">
                      <span
                        className={`text-sm font-bold ${getConfidenceColor(
                          selectedPrediction.confidence
                        )}`}
                      >
                        {(selectedPrediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              {selectedPrediction.categories && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Skor Kategori:</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedPrediction.categories).map(
                      ([category, score]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm capitalize">
                            {category}:
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={score * 100}
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-medium w-12">
                              {(score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Override Status */}
              {selectedPrediction.isOverridden && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Prediksi telah dioverride
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Diubah menjadi &ldquo;
                    {getLabelText(selectedPrediction.humanLabel!)}&rdquo; oleh{" "}
                    {selectedPrediction.overriddenBy}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Tutup
            </Button>
            {selectedPrediction && !selectedPrediction.isOverridden && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleOverride(selectedPrediction, "bullying")}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Bullying
                </Button>
                <Button
                  variant="default"
                  onClick={() =>
                    handleOverride(selectedPrediction, "non_bullying")
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Non-Bullying
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleOverride(selectedPrediction, "ambiguous")
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Ragu-ragu
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
