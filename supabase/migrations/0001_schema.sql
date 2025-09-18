-- Initial schema for YouTube comment moderation application
-- Enables Row Level Security and creates all necessary tables, enums, and indexes

-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- Create enum for user roles
create type public.user_role as enum ('annotator', 'reviewer', 'admin');

-- Table: profiles
-- One-to-one relationship with auth.users
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'annotator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pk_profiles primary key (id)
);

-- Table: videos
-- YouTube videos data
create table public.videos (
  id text not null,
  title text,
  thumbnail text,
  channel_id text,
  channel_title text,
  comment_count integer,
  last_sync timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pk_videos primary key (id)
);

-- Table: comments
-- YouTube comments (both top-level and replies)
create table public.comments (
  id text not null,
  video_id text not null references public.videos(id) on delete cascade,
  parent_id text,
  author text,
  text text not null,
  published_at timestamptz,
  like_count integer not null default 0,
  is_reply boolean generated always as (parent_id is not null) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pk_comments primary key (id)
);

-- Table: labels
-- Manual annotations by users
create table public.labels (
  id uuid not null default gen_random_uuid(),
  comment_id text not null references public.comments(id) on delete cascade,
  annotator_id uuid not null references public.profiles(id) on delete cascade,
  label text not null check (label in ('bullying', 'non_bullying', 'ambiguous')),
  note text,
  created_at timestamptz not null default now(),

  constraint pk_labels primary key (id),
  constraint uq_labels_comment_annotator unique (comment_id, annotator_id)
);

-- Table: predictions
-- Model/API predictions
create table public.predictions (
  id uuid not null default gen_random_uuid(),
  comment_id text not null references public.comments(id) on delete cascade,
  label text not null check (label in ('bullying', 'non_bullying', 'ambiguous')),
  confidence double precision not null check (confidence >= 0 and confidence <= 1),
  model_version text not null,
  raw jsonb,
  created_at timestamptz not null default now(),

  constraint pk_predictions primary key (id)
);

-- Table: imports
-- Import history
create table public.imports (
  id uuid not null default gen_random_uuid(),
  source text not null,
  video_id text references public.videos(id) on delete set null,
  file_name text,
  row_count integer,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),

  constraint pk_imports primary key (id)
);

-- Table: settings
-- Application settings (optional)
create table public.settings (
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),

  constraint pk_settings primary key (key)
);

-- Create indexes for performance
create index if not exists idx_comments_video_id on public.comments(video_id);
create index if not exists idx_comments_published_at on public.comments(published_at);
create index if not exists idx_labels_comment_id on public.labels(comment_id);
create index if not exists idx_labels_annotator_id on public.labels(annotator_id);
create index if not exists idx_predictions_comment_id on public.predictions(comment_id);

-- Create view for moderation queue
create or replace view public.v_moderation_queue as
select distinct on (c.id)
  c.id as comment_id,
  c.video_id,
  c.text,
  p.created_at as last_predicted_at,
  p.label as last_label,
  p.confidence as last_confidence
from public.comments c
left join public.predictions p on p.comment_id = c.id
order by c.id, p.created_at desc;
