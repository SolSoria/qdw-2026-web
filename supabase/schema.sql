create table if not exists public.content_items (
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

create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.content_items enable row level security;
drop policy if exists "Published content is public" on public.content_items;
drop policy if exists "Admins manage content" on public.content_items;
create policy "Published content is public" on public.content_items for select using (published = true);
create policy "Admins manage content" on public.content_items for all using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
on conflict (id) do nothing;

insert into public.content_items (id, type, title, description, image_path, sort_order)
values
  ('00000000-0000-0000-0000-000000000001', 'program', 'Design Stage', 'Conversaciones sobre el diseño que transforma nuestro futuro.', null, 1),
  ('00000000-0000-0000-0000-000000000002', 'program', 'Rutas de Diseño', '35 espacios abiertos en cinco distritos de Quito.', null, 2),
  ('00000000-0000-0000-0000-000000000003', 'program', 'Mercado de Diseño', 'Ideas, objetos y proyectos para descubrir.', null, 3),
  ('00000000-0000-0000-0000-000000000004', 'program', 'Exhibición', 'Una mirada a las prácticas que imaginan el futuro.', null, 4),
  ('00000000-0000-0000-0000-000000000005', 'program', 'Premiación', 'Celebramos el talento y el diseño ecuatoriano.', null, 5),
  ('00000000-0000-0000-0000-000000000006', 'program', 'Talleres', 'Experiencias prácticas para aprender haciendo.', null, 6),
  ('00000000-0000-0000-0000-000000000011', 'speaker', 'El Diseño Gráfico en Ecuador', '', '/assets/img/speaker-1.webp', 11),
  ('00000000-0000-0000-0000-000000000012', 'speaker', 'Innovación en materiales', '', '/assets/img/speaker-2.webp', 12),
  ('00000000-0000-0000-0000-000000000013', 'speaker', 'Fabricación digital', '', '/assets/img/speaker-3.webp', 13),
  ('00000000-0000-0000-0000-000000000014', 'speaker', 'Biomateriales en Latinoamérica', '', '/assets/img/speaker-4.webp', 14),
  ('00000000-0000-0000-0000-000000000015', 'speaker', 'Inspired by IED', '', '/assets/img/speaker-5.webp', 15),
  ('00000000-0000-0000-0000-000000000016', 'speaker', 'Diseño para la sostenibilidad', '', '/assets/img/speaker-6.webp', 16),
  ('00000000-0000-0000-0000-000000000017', 'speaker', 'Hyperdesign: diseño radical para nuevos imaginarios de futuro', '', '/assets/img/speaker-7.webp', 17),
  ('00000000-0000-0000-0000-000000000018', 'speaker', 'Construir una marca con identidad: de una idea a una comunidad', '', '/assets/img/speaker-8.webp', 18),
  ('00000000-0000-0000-0000-000000000019', 'speaker', 'Chiu x QDW', '', '/assets/img/speaker-10.webp', 19),
  ('00000000-0000-0000-0000-000000000020', 'speaker', 'La hospitalidad como destino cultural', '', null, 20),
  ('00000000-0000-0000-0000-000000000031', 'workshop', 'Construcción lógica del mensaje visual', '', '/assets/img/taller-1.webp', 31),
  ('00000000-0000-0000-0000-000000000032', 'workshop', 'Hyperdesign: explorando futuros, imaginarios y transiciones', '', '/assets/img/taller-2.webp', 32),
  ('00000000-0000-0000-0000-000000000033', 'workshop', 'Experiencia: El futuro de la hospitalidad', '', '/assets/img/taller-3.webp', 33),
  ('00000000-0000-0000-0000-000000000034', 'workshop', 'Diseñar a través del entrelazado: patrones y superficies textiles', '', '/assets/img/taller-4.webp', 34)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  image_path = excluded.image_path,
  sort_order = excluded.sort_order;
