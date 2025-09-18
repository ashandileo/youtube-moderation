import { NextRequest, NextResponse } from "next/server";
import { mockVideos } from "@/lib/mock";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    // Add realistic delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let videos = [...mockVideos];

    // Filter by search term if provided
    if (search) {
      videos = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.channelTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Limit results
    videos = videos.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: videos,
      total: videos.length,
    });
  } catch (error) {
    console.error("Videos API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
