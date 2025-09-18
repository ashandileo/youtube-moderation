-- Row Level Security policies for YouTube comment moderation application
-- Enables RLS on all tables and creates appropriate policies based on user roles

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.comments enable row level security;
alter table public.labels enable row level security;
alter table public.predictions enable row level security;
alter table public.imports enable row level security;
alter table public.settings enable row level security;

-- Policies for profiles table
create policy "Users can view their own profile or reviewers/admins can view all"
  on public.profiles for select
  using (
    auth.uid() = id 
    or public.is_reviewer_or_admin()
  );

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

create policy "Only authenticated users can insert profiles"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policies for videos table
create policy "All authenticated users can view videos"
  on public.videos for select
  to authenticated
  using (true);

create policy "Only admins can insert/update videos"
  on public.videos for insert
  to authenticated
  with check (public.is_admin());

create policy "Only admins can update videos"
  on public.videos for update
  to authenticated
  using (public.is_admin());

-- Policies for comments table
create policy "All authenticated users can view comments"
  on public.comments for select
  to authenticated
  using (true);

create policy "Only admins can insert/update comments"
  on public.comments for insert
  to authenticated
  with check (public.is_admin());

create policy "Only admins can update comments"
  on public.comments for update
  to authenticated
  using (public.is_admin());

-- Policies for labels table
create policy "Annotators can view their own labels, reviewers/admins can view all"
  on public.labels for select
  to authenticated
  using (
    annotator_id = auth.uid() 
    or public.is_reviewer_or_admin()
  );

create policy "Users can only insert labels for themselves"
  on public.labels for insert
  to authenticated
  with check (annotator_id = auth.uid());

create policy "Only reviewers/admins can update labels"
  on public.labels for update
  to authenticated
  using (public.is_reviewer_or_admin());

create policy "Only reviewers/admins can delete labels"
  on public.labels for delete
  to authenticated
  using (public.is_reviewer_or_admin());

-- Policies for predictions table
create policy "All authenticated users can view predictions"
  on public.predictions for select
  to authenticated
  using (true);

create policy "Only admins can insert predictions"
  on public.predictions for insert
  to authenticated
  with check (public.is_admin());

create policy "Only admins can update predictions"
  on public.predictions for update
  to authenticated
  using (public.is_admin());

create policy "Only admins can delete predictions"
  on public.predictions for delete
  to authenticated
  using (public.is_admin());

-- Policies for imports table
create policy "All authenticated users can view imports"
  on public.imports for select
  to authenticated
  using (true);

create policy "Only admins can insert imports"
  on public.imports for insert
  to authenticated
  with check (public.is_admin());

create policy "Only admins can update imports"
  on public.imports for update
  to authenticated
  using (public.is_admin());

create policy "Only admins can delete imports"
  on public.imports for delete
  to authenticated
  using (public.is_admin());

-- Policies for settings table
create policy "Only admins can view settings"
  on public.settings for select
  to authenticated
  using (public.is_admin());

create policy "Only admins can insert settings"
  on public.settings for insert
  to authenticated
  with check (public.is_admin());

create policy "Only admins can update settings"
  on public.settings for update
  to authenticated
  using (public.is_admin());

create policy "Only admins can delete settings"
  on public.settings for delete
  to authenticated
  using (public.is_admin());
