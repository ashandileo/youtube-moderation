import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function setupAuthUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing required environment variables");
    console.error(
      "Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const testUsers = [
    {
      email: "admin@example.com",
      password: "admin123",
      metadata: {
        full_name: "Admin User",
        role: "admin",
      },
    },
    {
      email: "annotator@example.com",
      password: "annotator123",
      metadata: {
        full_name: "Annotator User",
        role: "annotator",
      },
    },
  ];

  console.log("Setting up test users...");

  for (const user of testUsers) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const userExists = existingUsers?.users.some(
        (u) => u.email === user.email
      );

      if (userExists) {
        console.log(`User ${user.email} already exists`);
        continue;
      }

      // Create the user
      const { error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.metadata,
      });

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error.message);
    }
  }

  console.log("User setup completed!");
}

setupAuthUsers().catch(console.error);
