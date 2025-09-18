import { NextRequest, NextResponse } from "next/server";
import { mockComments } from "@/lib/mock";
import { type Comment } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Add realistic delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let comments = [...mockComments];

    // Filter by video ID if provided
    if (videoId) {
      comments = comments.filter(
        (comment: Comment) => comment.videoId === videoId
      );
    }

    // Filter by status if provided
    if (status && status !== "all") {
      if (status === "labeled") {
        comments = comments.filter(
          (comment: Comment) => comment.humanLabel !== undefined
        );
      } else if (status === "unlabeled") {
        comments = comments.filter(
          (comment: Comment) => comment.humanLabel === undefined
        );
      }
    }

    // Limit results
    comments = comments.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: comments,
      total: comments.length,
    });
  } catch (error) {
    console.error("Comments API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, label, labeledBy } = await request.json();

    // Add realistic delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock update - in real app, update database
    const updatedComment = {
      id,
      humanLabel: label,
      labeledBy,
      labeledAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedComment,
    });
  } catch (error) {
    console.error("Comment update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
