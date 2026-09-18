create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('program', 'speaker', 'workshop')),
  title text not null,
  description text not null default '',
  image_path text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.content_items enable row level security;
create policy "Published content is public" on public.content_items for select using (published = true);
create policy "Admins manage content" on public.content_items for all using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
on conflict (id) do nothing;
