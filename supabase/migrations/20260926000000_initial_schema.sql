create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.posters (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  image_path text not null check (char_length(btrim(image_path)) > 0),
  alt_text text not null check (char_length(btrim(alt_text)) between 1 and 240),
  starts_at timestamptz null,
  ends_at timestamptz null,
  sort_order integer not null check (sort_order >= 0),
  is_published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posters_valid_period check (starts_at is null or ends_at is null or starts_at < ends_at)
);

create index posters_public_order_idx on public.posters (sort_order asc, created_at desc) where is_published;
create index posters_schedule_idx on public.posters (starts_at, ends_at) where is_published;
create unique index posters_image_path_key on public.posters (image_path);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posters_set_updated_at before update on public.posters
for each row execute function public.set_updated_at();

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select check_user_id is not null and exists (
    select 1 from public.admin_users where user_id = check_user_id
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.posters enable row level security;

create policy "Users can read own admin membership"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create policy "Public can read active posters and admins can read all"
on public.posters for select to anon, authenticated
using (
  public.is_admin(auth.uid())
  or (
    is_published
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  )
);

create policy "Admins can insert posters"
on public.posters for insert to authenticated
with check (public.is_admin(auth.uid()) and created_by = auth.uid());

create policy "Admins can update posters"
on public.posters for update to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Admins can delete posters"
on public.posters for delete to authenticated
using (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posters', 'posters', false, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_read_poster_image(object_name text, check_user_id uuid default auth.uid())
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.posters p
    where p.image_path = object_name
      and (
        public.is_admin(check_user_id)
        or (
          p.is_published
          and (p.starts_at is null or p.starts_at <= now())
          and (p.ends_at is null or p.ends_at > now())
        )
      )
  );
$$;

revoke all on function public.can_read_poster_image(text, uuid) from public;
grant execute on function public.can_read_poster_image(text, uuid) to anon, authenticated;

create policy "Readable poster images follow poster visibility"
on storage.objects for select to anon, authenticated
using (bucket_id = 'posters' and public.can_read_poster_image(name, auth.uid()));

create policy "Admins can upload poster images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'posters'
  and public.is_admin(auth.uid())
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
);

create policy "Admins can update poster images"
on storage.objects for update to authenticated
using (bucket_id = 'posters' and public.is_admin(auth.uid()))
with check (bucket_id = 'posters' and public.is_admin(auth.uid()));

create policy "Admins can delete poster images"
on storage.objects for delete to authenticated
using (bucket_id = 'posters' and public.is_admin(auth.uid()));

grant select on public.posters to anon, authenticated;
grant insert, update, delete on public.posters to authenticated;
grant select on public.admin_users to authenticated;
