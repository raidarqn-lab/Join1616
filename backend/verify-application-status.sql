begin;
do $$
declare
 app_id text:='APP-STATUS-TEST-'||gen_random_uuid();
 code text:='1616-STATUS-TEST-'||upper(gen_random_uuid()::text);
 player_key text:='status-test-'||gen_random_uuid();
 summary jsonb; req jsonb;
begin
 if has_function_privilege('anon','public.transfer_application_status(jsonb)','execute') or has_function_privilege('authenticated','public.transfer_application_status(jsonb)','execute') then raise exception 'Public RPC access'; end if;
 req:=jsonb_build_object('requestType','application.status','confirmationCode',code);
 summary:=public.transfer_application_status(req);
 if summary->>'ok'<>'false' then raise exception 'Unknown code accepted'; end if;
 insert into transfer_private.applications(id,code_hash,payload) values(app_id,encode(sha256(convert_to(code,'UTF8')),'hex'),jsonb_build_object('applicationId',app_id,'username','Fictional applicant','confirmationCode',code,'contact','PRIVATE CONTACT','comments','PRIVATE NOTE'));
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,applicationStatus}' not in ('Received','Pending') or summary#>>'{status,approval}'<>'pending' then raise exception 'New application state'; end if;
 select key into player_key from transfer_private.portal_records where kind='players' and payload->>'applicationId'=app_id limit 1;
 if player_key is null then
  player_key:='status-test-'||gen_random_uuid();
  insert into transfer_private.portal_records(kind,key,revision,payload) values('players',player_key,1,'{}'::jsonb);
 end if;
 update transfer_private.portal_records set payload=jsonb_build_object('name','Fictional applicant','applicationIds',jsonb_build_array(app_id),'status','Pending','confirmedSeat','','seat','Gold','history',jsonb_build_array('PRIVATE HISTORY'),'assignedTo','PRIVATE TEAM EMAIL') where kind='players' and key=player_key;
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,applicationStatus}'<>'Pending' or summary#>>'{status,confirmedSeat}' is not null then raise exception 'Estimate exposed as confirmed'; end if;
 update transfer_private.portal_records set payload=payload||jsonb_build_object('status','Approved','confirmedSeat','Blue') where kind='players' and key=player_key;
 update transfer_private.portal_records set payload=jsonb_set(payload,array['data','assignments',player_key],'"NvSP"'::jsonb,true) where kind='shared' and key='transferOrganization';
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,approval}'<>'approved' or summary#>>'{status,confirmedSeat}'<>'Blue' or summary#>>'{status,destinationAlliance}'<>'NvSP' then raise exception 'Confirmed details mismatch'; end if;
 update transfer_private.portal_records set payload=payload||jsonb_build_object('status','Declined','rejectionReasonCode','other','rejectionReasonText','An applicant-facing explanation.') where kind='players' and key=player_key;
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,approval}'<>'declined' or summary#>>'{status,rejectionReasonText}'<>'An applicant-facing explanation.' or summary#>>'{status,destinationAlliance}' is not null then raise exception 'Rejection projection'; end if;
 if summary::text like '%PRIVATE%' or summary::text like '%'||code||'%' or summary::text like '%code_hash%' then raise exception 'Private information leaked'; end if;
 update transfer_private.portal_records set payload=payload||jsonb_build_object('status','Pending') where kind='players' and key=player_key;
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,rejectionReasonText}' is not null then raise exception 'Stale reason leaked'; end if;
 update transfer_private.portal_records set payload=payload||jsonb_build_object('status','Withdrawn') where kind='players' and key=player_key;
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,approval}'<>'withdrawn' or summary#>>'{status,destinationAlliance}' is not null or summary#>>'{status,confirmedSeat}' is not null then raise exception 'Withdrawn projection'; end if;
 update transfer_private.portal_records set payload=payload||jsonb_build_object('status','Unknown') where kind='players' and key=player_key;
 summary:=public.transfer_application_status(req);
 if summary#>>'{status,applicationStatus}'<>'Unconfirmed' or summary#>>'{status,approval}'<>'pending' then raise exception 'Unconfirmed projection'; end if;
 insert into transfer_private.portal_records(kind,key,revision,payload) select kind,player_key||'-duplicate',revision,payload from transfer_private.portal_records where kind='players' and key=player_key;
 if public.transfer_application_status(req)->>'ok'<>'false' then raise exception 'Ambiguous match accepted'; end if;
 update transfer_private.portal_records set payload=payload||'{"deleted":true}'::jsonb where kind='players' and key in (player_key,player_key||'-duplicate');
 if public.transfer_application_status(req)->>'ok'<>'false' then raise exception 'Deleted records exposed'; end if;
end;
$$;
select 'PASS: private receipt, new/pending/approved/rejected/withdrawn/unconfirmed states, selected alliance, confirmed-only seat, safe fields, stale reasons, ambiguous/deleted matches; all fixtures rolled back' as verification;
rollback;
