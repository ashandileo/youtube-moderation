#!/usr/bin/env node

/**
 * Script to add sample labels after users are created
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addSampleLabels() {
  console.log("🏷️  Adding sample labels...\n");

  try {
    // Get admin user
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .single();

    if (!adminProfile) {
      console.error("❌ Admin user not found");
      return;
    }

    console.log(`✅ Found admin user: ${adminProfile.id}`);

    // Add sample labels
    const { data, error } = await supabase.from("labels").insert([
      {
        comment_id: "C1",
        annotator_id: adminProfile.id,
        label: "non_bullying",
        note: "Positive and constructive comment",
      },
      {
        comment_id: "C2",
        annotator_id: adminProfile.id,
        label: "bullying",
        note: "Contains personal attacks and insults",
      },
    ]);

    if (error) {
      console.error("❌ Error adding labels:", error.message);
    } else {
      console.log("✅ Added sample labels");
    }

    // Add sample import record
    const { error: importError } = await supabase.from("imports").insert({
      source: "youtube_api",
      video_id: "XYZ123",
      file_name: "comments_XYZ123_20250918.json",
      row_count: 3,
      created_by: adminProfile.id,
    });

    if (importError) {
      console.error("❌ Error adding import record:", importError.message);
    } else {
      console.log("✅ Added sample import record");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

addSampleLabels().catch(console.error);
