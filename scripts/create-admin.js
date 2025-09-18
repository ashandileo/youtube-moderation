import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

async function createAdminUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log("Creating admin user with new email...");

    const { error } = await supabase.auth.admin.createUser({
      email: "admin2@example.com",
      password: "admin123",
      email_confirm: true,
      user_metadata: {
        full_name: "Admin User",
        role: "admin",
      },
    });

    if (error) {
      console.error(`Error creating admin user:`, error.message);
    } else {
      console.log(
        `✅ Created user: admin2@example.com with password: admin123`
      );
    }
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
}

createAdminUser();
