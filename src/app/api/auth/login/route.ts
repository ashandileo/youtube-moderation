import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication - in real app, validate against database
    if (email === "admin@example.com" && password === "admin123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
        },
        token: "mock_jwt_token_here",
      });
    }

    if (email === "annotator@example.com" && password === "annotator123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "2",
          email: "annotator@example.com",
          name: "Annotator User",
          role: "annotator",
        },
        token: "mock_jwt_token_here",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
