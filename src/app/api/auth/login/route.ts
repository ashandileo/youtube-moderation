import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // For development, create test users if they don't exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseServiceRoleKey && (email === "admin@example.com" || email === "annotator@example.com")) {
      // Create admin client for user management
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      // Check if user exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUsers?.users.some(u => u.email === email);

      // Create user if doesn't exist
      if (!userExists) {
        const { error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: email === "admin@example.com" ? "Admin User" : "Annotator User",
            role: email === "admin@example.com" ? "admin" : "annotator"
          }
        });

        if (createError) {
          console.error("Error creating user:", createError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "User setup completed"
    });

  } catch (error) {
    console.error("Login setup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
