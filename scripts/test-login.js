// Test login script
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log("Testing login with annotator@example.com...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: "annotator@example.com",
      password: "annotator123",
    });

    if (error) {
      console.error("Login failed:", error.message);
      return;
    }

    console.log("Login successful!");
    console.log("User ID:", data.user?.id);
    console.log("User email:", data.user?.email);
    console.log("Session exists:", !!data.session);

    // Test session retrieval
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Current session exists:", !!sessionData.session);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testLogin();
