"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Kbd } from "@/components/common/kbd";
import {
  User,
  Calendar,
  Heart,
  Languages,
  Hash,
  ArrowRight,
  SkipForward,
} from "lucide-react";
import { type Comment, type Label } from "@/lib/types";

interface AnnotationCardProps {
  comment: Comment | null;
  onLabel: (label: Label) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function AnnotationCard({
  comment,
  onLabel,
  onSkip,
  isLoading = false,
}: AnnotationCardProps) {
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const handleLabelSelect = useCallback(
    (label: Label) => {
      setSelectedLabel(label);
      setTimeout(() => {
        onLabel(label);
        setSelectedLabel(null);
      }, 100);
    },
    [onLabel]
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return; // Don't trigger shortcuts when typing in inputs
      }

      switch (event.key) {
        case "1":
          event.preventDefault();
          handleLabelSelect("bullying");
          break;
        case "2":
          event.preventDefault();
          handleLabelSelect("non_bullying");
          break;
        case "3":
          event.preventDefault();
          handleLabelSelect("ambiguous");
          break;
        case "s":
        case "S":
          event.preventDefault();
          onSkip();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onSkip, onLabel, handleLabelSelect]);

  const getLabelColor = (label: Label) => {
    switch (label) {
      case "bullying":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "non_bullying":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "ambiguous":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
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

  if (isLoading || !comment) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Komentar untuk Dilabel</span>
          <div className="flex items-center gap-2">
            {comment.language && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                {comment.language.toUpperCase()}
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {comment.text.length} karakter
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Text */}
        <div className="prose prose-sm max-w-none">
          <p className="text-lg leading-relaxed font-medium bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            &ldquo;{comment.text}&rdquo;
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{comment.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(comment.publishedAt).toLocaleString("id-ID")}</span>
          </div>
          {comment.likeCount !== undefined && (
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{comment.likeCount} likes</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Label Buttons */}
        <div className="space-y-4">
          <h3 className="font-semibold">Pilih Label:</h3>
          <div className="grid gap-3">
            <Button
              onClick={() => handleLabelSelect("bullying")}
              className={`${getLabelColor(
                "bullying"
              )} justify-between p-4 h-auto`}
              disabled={isLoading}
              variant={selectedLabel === "bullying" ? "default" : "outline"}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">Bullying</span>
                <span className="text-sm opacity-90">
                  - Mengandung pelecehan, intimidasi, atau ujaran kebencian
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>1</Kbd>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Button>

            <Button
              onClick={() => handleLabelSelect("non_bullying")}
              className={`${getLabelColor(
                "non_bullying"
              )} justify-between p-4 h-auto`}
              disabled={isLoading}
              variant={selectedLabel === "non_bullying" ? "default" : "outline"}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">Non-Bullying</span>
                <span className="text-sm opacity-90">
                  - Komentar normal, konstruktif, atau netral
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>2</Kbd>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Button>

            <Button
              onClick={() => handleLabelSelect("ambiguous")}
              className={`${getLabelColor(
                "ambiguous"
              )} justify-between p-4 h-auto`}
              disabled={isLoading}
              variant={selectedLabel === "ambiguous" ? "default" : "outline"}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">Ragu-ragu</span>
                <span className="text-sm opacity-90">
                  - Tidak jelas atau sulit dikategorikan
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>3</Kbd>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Button>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="w-full"
              disabled={isLoading}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Lewati Komentar Ini
              <Kbd className="ml-2">S</Kbd>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
