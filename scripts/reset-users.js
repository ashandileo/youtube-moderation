import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function resetUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing required environment variables");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log("Listing existing users...");
    const { data: existingUsers } = await supabase.auth.admin.listUsers();

    if (existingUsers?.users) {
      console.log(`Found ${existingUsers.users.length} users:`);
      for (const user of existingUsers.users) {
        console.log(`- ${user.email} (ID: ${user.id})`);

        // Delete test users
        if (
          user.email === "admin@example.com" ||
          user.email === "annotator@example.com"
        ) {
          console.log(`Deleting user ${user.email}...`);
          const { error } = await supabase.auth.admin.deleteUser(user.id);
          if (error) {
            console.error(`Error deleting ${user.email}:`, error.message);
          } else {
            console.log(`✅ Deleted user: ${user.email}`);
          }
        }
      }
    }

    // Now recreate test users
    console.log("\nCreating fresh test users...");

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

    for (const user of testUsers) {
      const { error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.metadata,
      });

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message);
      } else {
        console.log(
          `✅ Created user: ${user.email} with password: ${user.password}`
        );
      }
    }

    console.log("\nUser reset completed!");
  } catch (error) {
    console.error("Reset failed:", error);
  }
}

resetUsers();
