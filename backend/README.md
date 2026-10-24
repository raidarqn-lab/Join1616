# Applicant review status

The live intake function now includes `applicationStatus` with successful `application.lookup` responses. The existing confirmation-code and Turnstile checks and shared rate limit are preserved. Applicants see the summary at the top of Edit my application; no extra account is needed.

Deploy `application-status.sql` to the existing active Supabase project, then `intake-public.ts` to the existing `intake-public` Edge Function. The SQL RPC is executable only by service_role and returns an explicit allowlist of status, approval, selected alliance, confirmed seat, and applicant-facing rejection fields. It never returns team notes, contacts, assignments to staff, or application codes. Ambiguous/deleted links fail closed; unlinked received applications remain pending. The confirmation code is submitted in the POST body, not the URL.

`verify-application-status.sql` runs synthetic integration checks in a transaction and rolls them back. Application insertion uses the existing trigger, which creates a Pending portal record. No real application statuses are changed by deployment.

The companion transfer portal change adds required standard or custom rejection reasons. Its stored status remains `Declined` for compatibility; the applicant and rejection selector display `Rejected`. Existing rejections without recorded reasons show a prompt to contact the transfer team. Saved rejection messages are shown exactly as entered, including edits to standard templates. Historical rejections without a saved message retain their translated reason-label fallback. The portal offers ten selectable reasons with editable apology templates; publish the updated SQL projection and portal-public function before releasing the new dropdown.
