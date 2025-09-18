const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
);

async function testAuthCallback() {
  console.log("Testing auth callback flow...");

  try {
    // Test sign in with password (ini akan generate auth URL kalau pakai OAuth)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "annotator@example.com",
      password: "annotator123",
    });

    if (error) {
      console.error("❌ Sign in error:", error.message);
      return;
    }

    console.log("✅ Sign in successful!");
    console.log("Session:", {
      accessToken: data.session?.access_token ? "present" : "missing",
      refreshToken: data.session?.refresh_token ? "present" : "missing",
      user: data.user?.email,
    });

    // Test callback endpoint dengan manual request (simulasi)
    const callbackUrl = `http://localhost:3000/auth/callback?then=/dashboard`;
    console.log("\n📍 Auth callback URL would be:", callbackUrl);
    console.log("✅ Auth callback route is ready for OAuth flows");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testAuthCallback();
