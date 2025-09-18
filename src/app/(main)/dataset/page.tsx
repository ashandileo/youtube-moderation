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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Database,
} from "lucide-react";
import { mockAPI } from "@/lib/mock";
import { type Comment } from "@/lib/types";
import { toast } from "sonner";

export default function DatasetPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<Comment[]>([]);
  const [exportFormat, setExportFormat] = useState<"csv" | "jsonl">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewData([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      const result = await mockAPI.importDataset(selectedFile);
      setPreviewData(result.preview);
      toast.success(`Berhasil mengimport ${result.imported} komentar`);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await mockAPI.exportDataset(exportFormat);

      // Create download link
      const blob = new Blob([data], {
        type: exportFormat === "csv" ? "text/csv" : "application/jsonl",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dataset_export.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `Dataset berhasil diexport dalam format ${exportFormat.toUpperCase()}`
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengexport dataset");
    } finally {
      setIsExporting(false);
    }
  };

  const mockImportHistory = [
    {
      id: "1",
      filename: "comments_batch_1.csv",
      rows: 1500,
      imported: "2024-01-15T10:30:00Z",
      status: "success",
    },
    {
      id: "2",
      filename: "youtube_comments_jan.jsonl",
      rows: 2300,
      imported: "2024-01-14T15:20:00Z",
      status: "success",
    },
    {
      id: "3",
      filename: "validation_set.csv",
      rows: 800,
      imported: "2024-01-13T09:15:00Z",
      status: "partial",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset Management"
        description="Import dan export dataset komentar untuk training model"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Dataset
            </CardTitle>
            <CardDescription>
              Upload file CSV atau JSONL berisi komentar untuk training
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.jsonl,.json"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mendukung format: CSV, JSONL (maksimal 50MB)
              </p>
            </div>

            {selectedFile && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? "Mengupload..." : "Upload Dataset"}
            </Button>

            {previewData.length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">
                  Preview Data (10 baris pertama):
                </h4>
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Text</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 10).map((comment, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="max-w-xs">
                            <p className="text-sm line-clamp-2">
                              {comment.text}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">
                            {comment.author}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(comment.publishedAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Dataset
            </CardTitle>
            <CardDescription>
              Download dataset berlabel untuk training atau validasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="export-format" className="text-sm font-medium">
                Format Export:
              </label>
              <Select
                value={exportFormat}
                onValueChange={(value) =>
                  setExportFormat(value as "csv" | "jsonl")
                }
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Pilih format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel compatible)</SelectItem>
                  <SelectItem value="jsonl">JSONL (JSON Lines)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-gray-50 border rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Total komentar:</span>
                  <span className="font-medium">3,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Sudah berlabel:</span>
                  <span className="font-medium text-green-600">2,850</span>
                </div>
                <div className="flex justify-between">
                  <span>Belum berlabel:</span>
                  <span className="font-medium text-orange-600">350</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting
                ? "Mengexport..."
                : `Export sebagai ${exportFormat.toUpperCase()}`}
            </Button>

            <div className="text-xs text-muted-foreground">
              * Export hanya mencakup komentar yang sudah memiliki label
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Riwayat Import
          </CardTitle>
          <CardDescription>
            Daftar file yang telah diimport ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama File</TableHead>
                <TableHead>Jumlah Baris</TableHead>
                <TableHead>Tanggal Import</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockImportHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{record.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {record.rows.toLocaleString()} rows
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(record.imported).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {record.status === "success" ? (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1 w-fit"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Success
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-fit"
                      >
                        <AlertCircle className="h-3 w-3" />
                        Partial
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">3,200</div>
              <div className="text-sm text-muted-foreground">
                Total Komentar
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-muted-foreground">
                Progress Labeling
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-muted-foreground">Video Sources</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
