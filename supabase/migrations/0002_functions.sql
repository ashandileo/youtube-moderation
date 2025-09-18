-- Functions and triggers for YouTube comment moderation application
-- Creates utility functions, triggers for updated_at, and RPC functions

-- Function: Touch updated_at timestamp
create or replace function public.fn_touch_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach updated_at trigger to relevant tables
create trigger tr_profiles_updated_at
  before update on public.profiles
  for each row execute function public.fn_touch_updated_at();

create trigger tr_videos_updated_at
  before update on public.videos
  for each row execute function public.fn_touch_updated_at();

create trigger tr_comments_updated_at
  before update on public.comments
  for each row execute function public.fn_touch_updated_at();

create trigger tr_settings_updated_at
  before update on public.settings
  for each row execute function public.fn_touch_updated_at();

-- Function: Get current user role
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
as $$
  select coalesce(p.role, 'annotator'::public.user_role)
  from public.profiles p
  where p.id = auth.uid();
$$;

-- Function: Check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select public.current_user_role() = 'admin';
$$;

-- Function: Check if current user is reviewer or admin
create or replace function public.is_reviewer_or_admin()
returns boolean
language sql
stable
security definer
as $$
  select public.current_user_role() in ('reviewer', 'admin');
$$;

-- RPC Function: Get next comment for annotation
create or replace function public.rpc_get_next_comment(
  in_video_id text,
  randomize boolean default true
)
returns table (
  id text,
  video_id text,
  parent_id text,
  author text,
  text text,
  published_at timestamptz,
  like_count integer,
  is_reply boolean
)
language sql
security definer
as $$
  select 
    c.id,
    c.video_id,
    c.parent_id,
    c.author,
    c.text,
    c.published_at,
    c.like_count,
    c.is_reply
  from public.comments c
  where c.video_id = in_video_id
    and not exists (
      select 1 
      from public.labels l 
      where l.comment_id = c.id 
        and l.annotator_id = auth.uid()
    )
  order by 
    case when randomize then random() else null end,
    case when not randomize then c.published_at else null end desc
  limit 1;
$$;

-- RPC Function: Upsert prediction
create or replace function public.rpc_upsert_prediction(
  in_comment_id text,
  in_label text,
  in_confidence double precision,
  in_model_version text,
  in_raw jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  prediction_id uuid;
begin
  -- Validate inputs
  if in_label not in ('bullying', 'non_bullying', 'ambiguous') then
    raise exception 'Invalid label: %', in_label;
  end if;
  
  if in_confidence < 0 or in_confidence > 1 then
    raise exception 'Confidence must be between 0 and 1, got: %', in_confidence;
  end if;
  
  -- Insert prediction
  insert into public.predictions (
    comment_id,
    label,
    confidence,
    model_version,
    raw
  ) values (
    in_comment_id,
    in_label,
    in_confidence,
    in_model_version,
    in_raw
  )
  returning id into prediction_id;
  
  return prediction_id;
end;
$$;
