# Applicant review status

The live intake function now includes `applicationStatus` with successful `application.lookup` responses. The existing confirmation-code and Turnstile checks and shared rate limit are preserved. Applicants see the summary at the top of Edit my application; no extra account is needed.

Deploy `application-status.sql` to the existing active Supabase project, then `intake-public.ts` to the existing `intake-public` Edge Function. The SQL RPC is executable only by service_role and returns an explicit allowlist of status, approval, selected alliance, confirmed seat, and applicant-facing rejection fields. It never returns team notes, contacts, assignments to staff, or application codes. Ambiguous/deleted links fail closed; unlinked received applications remain pending. The confirmation code is submitted in the POST body, not the URL.

`verify-application-status.sql` runs synthetic integration checks in a transaction and rolls them back. Application insertion uses the existing trigger, which creates a Pending portal record. No real application statuses are changed by deployment.

The companion transfer portal change adds required standard or custom rejection reasons. Its stored status remains `Declined` for compatibility; the applicant and rejection selector display `Rejected`. Existing rejections without recorded reasons show a prompt to contact the transfer team. Saved rejection messages are shown exactly as entered, including edits to standard templates. Historical rejections without a saved message retain their translated reason-label fallback. The portal offers ten selectable reasons with editable apology templates; publish the updated SQL projection and portal-public function before releasing the new dropdown.

## Alliance rules link

The companion portal migration `backend/alliance-guidelines.sql` adds `allianceGuidelines` (published introduction, guidelines, eight-language translations and publication date only) to the existing verified status response. The link appears beneath a known destination alliance and opens a text-only dialog. Unpublished alliances show a clear placeholder; drafts and audit/author data are never returned. Leadership edits content in Alliance Hub → Alliance guidelines. No rules are seeded.

The dialog follows the selected site language: English, Spanish, Portuguese, French, Arabic, Vietnamese, Korean or German. Arabic uses RTL layout. Missing translations do not silently display English. Publication in the hub requires all eight translations; supplied alliance text can be translated and entered before publication.

Shareable rules pages now use the public read-only `published_alliance_rules` RPC from the portal migration. `/alliances/nvsp/` is the stable NvSP address; `?lang=` preserves the selected language. Only published translations are returned. The files under `content/alliance-rules/nvsp` record the supplied English policy and initial translations; the live page reads the hub publication, not these snapshots. English editing notes were excluded.
