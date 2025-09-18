#!/usr/bin/env node

/**
 * Script to create development users using Supabase Auth API
 * Run this after database migrations are applied
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const devUsers = [
  {
    email: "admin@example.com",
    password: "password123",
    full_name: "Admin User",
    role: "admin",
  },
  {
    email: "reviewer@example.com",
    password: "password123",
    full_name: "Reviewer User",
    role: "reviewer",
  },
  {
    email: "annotator@example.com",
    password: "password123",
    full_name: "Annotator User",
    role: "annotator",
  },
];

async function createDevUsers() {
  console.log("🚀 Creating development users...\n");

  for (const user of devUsers) {
    console.log(`📝 Creating user: ${user.email}`);

    try {
      // Create user using admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          console.log(`   ⚠️  User ${user.email} already exists`);
        } else {
          console.error(`   ❌ Error creating ${user.email}:`, error.message);
        }
        continue;
      }

      if (data?.user) {
        console.log(`   ✅ Created user: ${user.email} (ID: ${data.user.id})`);

        // Update profile with correct role
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: user.role,
            full_name: user.full_name,
          })
          .eq("id", data.user.id);

        if (profileError) {
          console.error(
            `   ❌ Error updating profile for ${user.email}:`,
            profileError.message
          );
        } else {
          console.log(`   ✅ Updated profile role to: ${user.role}`);
        }
      }
    } catch (err) {
      console.error(`   ❌ Unexpected error for ${user.email}:`, err);
    }

    console.log(); // Add blank line
  }

  console.log("🎉 Development users setup complete!");
  console.log("\n📋 Login credentials:");
  devUsers.forEach((user) => {
    console.log(
      `   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`
    );
  });
  console.log("\n🌐 Access your app at: http://localhost:3000/login");
}

// Run the script
createDevUsers().catch(console.error);
