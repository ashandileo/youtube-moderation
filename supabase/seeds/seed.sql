-- Seed data for YouTube comment moderation application
-- Creates sample data for testing and development

-- Insert admin profile (replace UUID with actual auth.users id in production)
insert into public.profiles (id, full_name, role)
values ('00000000-0000-0000-0000-000000000001', 'Ashandi Leonadi', 'admin')
on conflict (id) do nothing;

-- Insert sample video
insert into public.videos (
  id,
  title,
  thumbnail,
  channel_id,
  channel_title,
  comment_count,
  last_sync
) values (
  'XYZ123',
  'Sample YouTube Video - Bullying Detection Research',
  'https://i.ytimg.com/vi/XYZ123/maxresdefault.jpg',
  'UC123456789',
  'Research Channel',
  3,
  now()
)
on conflict (id) do nothing;

-- Insert sample comments (2 top-level, 1 reply)
insert into public.comments (
  id,
  video_id,
  parent_id,
  author,
  text,
  published_at,
  like_count
) values 
(
  'C1',
  'XYZ123',
  null,
  'User1',
  'Great video, very informative content about this topic!',
  now() - interval '2 hours',
  5
),
(
  'C2',
  'XYZ123',
  null,
  'User2',
  'You are so stupid and ugly, nobody likes you!',
  now() - interval '1 hour',
  0
),
(
  'C3',
  'XYZ123',
  'C2',
  'User3',
  'That comment is inappropriate and hurtful.',
  now() - interval '30 minutes',
  2
)
on conflict (id) do nothing;

-- Insert sample manual labels by admin
insert into public.labels (
  comment_id,
  annotator_id,
  label,
  note
) values 
(
  'C1',
  '00000000-0000-0000-0000-000000000001',
  'non_bullying',
  'Positive and constructive comment'
),
(
  'C2',
  '00000000-0000-0000-0000-000000000001',
  'bullying',
  'Contains personal attacks and insults'
)
on conflict (comment_id, annotator_id) do nothing;

-- Insert sample predictions
insert into public.predictions (
  comment_id,
  label,
  confidence,
  model_version,
  raw
) values 
(
  'C1',
  'non_bullying',
  0.98,
  'openai-omni-moderation-2025-09',
  '{"categories": {"harassment": false, "harassment/threatening": false, "hate": false, "hate/threatening": false, "self-harm": false, "self-harm/instructions": false, "self-harm/intent": false, "sexual": false, "sexual/minors": false, "violence": false, "violence/graphic": false}, "category_scores": {"harassment": 0.02, "harassment/threatening": 0.01, "hate": 0.01, "hate/threatening": 0.0, "self-harm": 0.0, "self-harm/instructions": 0.0, "self-harm/intent": 0.0, "sexual": 0.0, "sexual/minors": 0.0, "violence": 0.0, "violence/graphic": 0.0}}'::jsonb
),
(
  'C2',
  'bullying',
  0.87,
  'openai-omni-moderation-2025-09',
  '{"categories": {"harassment": true, "harassment/threatening": false, "hate": true, "hate/threatening": false, "self-harm": false, "self-harm/instructions": false, "self-harm/intent": false, "sexual": false, "sexual/minors": false, "violence": false, "violence/graphic": false}, "category_scores": {"harassment": 0.89, "harassment/threatening": 0.15, "hate": 0.76, "hate/threatening": 0.02, "self-harm": 0.01, "self-harm/instructions": 0.0, "self-harm/intent": 0.0, "sexual": 0.02, "sexual/minors": 0.0, "violence": 0.12, "violence/graphic": 0.01}}'::jsonb
)
on conflict do nothing;

-- Insert sample import record
insert into public.imports (
  source,
  video_id,
  file_name,
  row_count,
  created_by
) values (
  'youtube_api',
  'XYZ123',
  'comments_XYZ123_20250918.json',
  3,
  '00000000-0000-0000-0000-000000000001'
)
on conflict do nothing;

-- Insert sample settings
insert into public.settings (key, value)
values 
('moderation_threshold', '0.5'::jsonb),
('auto_flag_threshold', '0.8'::jsonb),
('model_version', '"openai-omni-moderation-2025-09"'::jsonb)
on conflict (key) do nothing;
