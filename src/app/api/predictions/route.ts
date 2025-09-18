import { NextRequest, NextResponse } from "next/server";
import { mockAPI } from "@/lib/mock";
import { type Label } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get("label") as Label;
    const videoId = searchParams.get("videoId") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Add realistic delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const filters = {
      label: label || undefined,
      videoId,
      page,
      limit,
    };

    const result = await mockAPI.getPredictions(filters);

    return NextResponse.json({
      success: true,
      data: result.predictions,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    // Add realistic delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock approval/rejection - in real app, update database
    console.log(`${action}ing prediction ${id}`);

    return NextResponse.json({
      success: true,
      message: `Prediction ${action}d successfully`,
    });
  } catch (error) {
    console.error("Prediction action error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
