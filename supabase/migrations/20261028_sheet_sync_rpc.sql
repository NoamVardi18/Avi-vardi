-- Google Sheets sync without reopening public.leads (applied 2026-10-28).
--
-- Since the 2026-08-03 lockdown anon may only INSERT into public.leads, so the Apps Script
-- (google-sheets-sync/SupabaseSync.gs), which read the table with the public anon key, gets 401.
-- Instead of granting SELECT back, the script calls this function with a token kept in its Script
-- Properties. Only the token's SHA-256 is stored here, in a schema no API role can see; the anon
-- key alone still reads nothing.

create schema if not exists avi_private;
revoke all on schema avi_private from public, anon, authenticated;

create table if not exists avi_private.sheet_sync_token (
  id int primary key default 1 check (id = 1),
  token_sha256 text not null,
  created_at timestamptz not null default now()
);
revoke all on avi_private.sheet_sync_token from public, anon, authenticated;

create or replace function public.avi_leads_for_sheet(p_token text)
returns setof public.leads
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_token is null or not exists (
    select 1 from avi_private.sheet_sync_token t
    where t.token_sha256 = encode(pg_catalog.sha256(convert_to(p_token, 'UTF8')), 'hex')
  ) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query select * from public.leads order by created_at desc;
end;
$$;

revoke all on function public.avi_leads_for_sheet(text) from public, anon, authenticated;
grant execute on function public.avi_leads_for_sheet(text) to anon;

-- The token hash itself is set out of band (never committed):
--   insert into avi_private.sheet_sync_token (token_sha256) values ('<sha256 hex>')
--   on conflict (id) do update set token_sha256 = excluded.token_sha256, created_at = now();
