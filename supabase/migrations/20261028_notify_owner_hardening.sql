-- notify-owner hardening (applied 2026-10-28).
--
-- 1. The Resend key left the function source. It lives in Supabase Vault as 'avi_resend_api_key'
--    (created out of band with vault.create_secret, never committed); the function reads it through
--    this accessor, which only service_role may call. An Edge Function secret RESEND_API_KEY, if
--    set, takes precedence.
-- 2. The trigger sends only the new lead's id. The function's URL is public (verify_jwt=false,
--    pg_net has no JWT), so it now reads the row itself instead of trusting a posted record —
--    which also gives it the email column the old payload left out, so the customer confirmation
--    can actually run.

create or replace function public.avi_resend_api_key()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'avi_resend_api_key' limit 1;
$$;

revoke all on function public.avi_resend_api_key() from public, anon, authenticated;
grant execute on function public.avi_resend_api_key() to service_role;

create or replace function public.notify_owner_on_lead()
returns trigger
language plpgsql
as $function$
begin
  perform net.http_post(
    url := 'https://nlwkksivgubcgfzqivcs.supabase.co/functions/v1/notify-owner',
    body := json_build_object('type', 'INSERT', 'table', 'leads', 'record', json_build_object('id', NEW.id))::jsonb,
    headers := '{"Content-Type":"application/json"}'::jsonb
  );
  return NEW;
end;
$function$;
