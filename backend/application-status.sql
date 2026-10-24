begin;
-- Private receipt lookup: no public table access and no applicant payload returned.
create or replace function public.transfer_application_status(request jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 code text:=upper(regexp_replace(coalesce(request->>'confirmationCode',''),'\s','','g'));
 a transfer_private.applications%rowtype;
 p jsonb; player_key text; matches integer; linked integer; current_status text; decision text;
 destination text; seat text;
begin
 if request->>'requestType' is distinct from 'application.status' or code !~ '^1616-[A-Z0-9-]{8,60}$' then
  return jsonb_build_object('ok',false,'errorCode','unavailable');
 end if;
 select * into a from transfer_private.applications where code_hash=encode(sha256(convert_to(code,'UTF8')),'hex');
 if a.id is null then return jsonb_build_object('ok',false,'errorCode','unavailable'); end if;
 select count(*),count(*) filter(where coalesce(payload->>'deleted','false')<>'true') into linked,matches
 from transfer_private.portal_records where kind='players' and (payload->>'applicationId'=a.id or coalesce(payload->'applicationIds','[]'::jsonb) ? a.id);
 if matches>1 or (linked>0 and matches=0) then return jsonb_build_object('ok',false,'errorCode','unavailable'); end if;
 if matches=1 then
  select key,payload into player_key,p from transfer_private.portal_records where kind='players'
   and coalesce(payload->>'deleted','false')<>'true'
   and (payload->>'applicationId'=a.id or coalesce(payload->'applicationIds','[]'::jsonb) ? a.id);
 end if;
 current_status:=case when matches=0 then 'Received'
  when coalesce(p->>'general','false')='true' or coalesce(p->>'prospect','false')='true' or p->>'transferDirection'='outbound' then 'Unconfirmed'
  when p->>'status' in ('Pending','Under Review','Approved','Waitlisted','Declined','Withdrawn','Transferred') then p->>'status'
  else 'Unconfirmed' end;
 decision:=case when current_status in ('Approved','Transferred') then 'approved' when current_status='Declined' then 'declined' when current_status='Withdrawn' then 'withdrawn' else 'pending' end;
 if matches=1 and current_status not in ('Declined','Withdrawn','Unconfirmed') then
  select payload#>>array['data','assignments',player_key] into destination from transfer_private.portal_records where kind='shared' and key='transferOrganization';
  if destination is null or destination not in ('NvSP','NvEM','WaE','DRoN','ECKO') then destination:=null; end if;
  if p->>'confirmedSeat' in ('Gold','Purple','Blue','White') then seat:=p->>'confirmedSeat'; end if;
 end if;
 return jsonb_build_object('ok',true,'status',jsonb_build_object(
  'playerName',coalesce(nullif(p->>'name',''),a.payload->>'username'),
  'applicationStatus',current_status,'approval',decision,'destinationAlliance',destination,
  'confirmedSeat',seat,'rejectionReasonCode',case when current_status='Declined' and p->>'rejectionReasonCode' in ('no_seat','low_kills','low_profession','low_hq','low_participation','low_power','group_full','conflict','not_specified','other','requirements','placement','information') then p->>'rejectionReasonCode' end,
  'rejectionReasonText',case when current_status='Declined' and p->>'rejectionReasonCode' in ('no_seat','low_kills','low_profession','low_hq','low_participation','low_power','group_full','conflict','not_specified','other','requirements','placement','information') then left(p->>'rejectionReasonText',1000) end,'receivedAt',a.created_at,'checkedAt',clock_timestamp()));
end;
$$;
revoke all on function public.transfer_application_status(jsonb) from public,anon,authenticated;
grant execute on function public.transfer_application_status(jsonb) to service_role;
commit;
