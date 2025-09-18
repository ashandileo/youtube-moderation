****# YouTube Moderation Database Setup

## Prerequisites
- Docker Desktop must be running
- Supabase CLI installed

## Database Commands

### Start Local Development
```bash
supabase start
```

### Stop Local Development
```bash
supabase stop
```

### Reset Database (apply all migrations and seeds)
```bash
supabase db reset
```

### Apply New Migrations
```bash
supabase db push
```

### Generate Types (for TypeScript)
```bash
supabase gen types typescript --local > src/lib/database.types.ts
```

## Database URLs

- **API URL**: http://127.0.0.1:54321
- **Database URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Studio URL**: http://127.0.0.1:54323 (Database admin interface)

## Authentication Keys

- **anon key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU`

## Database Schema

### Tables
- `profiles` - User profiles (linked to auth.users)
- `videos` - YouTube videos
- `comments` - YouTube comments (top-level and replies)
- `labels` - Manual annotations by users
- `predictions` - ML model predictions
- `imports` - Import history
- `settings` - Application settings

### Key Functions
- `rpc_get_next_comment(video_id, randomize)` - Get next comment for annotation
- `rpc_upsert_prediction(comment_id, label, confidence, model_version, raw)` - Insert ML prediction

### Views
- `v_moderation_queue` - Comments with latest predictions for moderation

## Environment Variables for Next.js

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

## Notes

- The seed data creates sample videos, comments, and predictions
- User profiles must be created through proper authentication
- RLS policies are active on all tables
- Use the Studio URL to browse and manage data visually
