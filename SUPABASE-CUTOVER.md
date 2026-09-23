# Application cutover candidate

Do not merge until the coordinated application and portal switch is approved. This branch routes new submissions, confirmation-code recall, edits and questions to `intake-public`. The production endpoint remains disabled until release. It preserves the current main branch design, including support links, compact confirmation and edit workflow.

Only the public Turnstile site key and Supabase publishable key are browser configuration. The server verifies each token with Siteverify, requires action `transfer_intake`, and checks the exact matching hostname `join1616.com` or `www.join1616.com`. Secrets stay in Supabase.

Questions use stable retry IDs to prevent duplicate Discord deliveries. Two-way chat remains disabled as agreed; its background readiness probe does not prompt verification or make a network request. Tokens are obtained afresh for actual actions. Verification cancellation leaves the form intact.

Before merging:

1. Approve and establish a brief write freeze across the application and portal.
2. Capture current deployed revisions, perform a fresh source/target reconciliation and apply only a reviewed delta. Preserve current live member profiles and access.
3. Coordinate with the portal release so new applications and team edits use the same data store. Do not assume the inactive Sheets bridge is syncing.
4. Enable the production endpoints only as part of the approved switch, then verify real-domain create, recall, update, question delivery and authenticated portal saves. Keep intake closed if checks fail.
5. Lift the freeze after acceptance. Retain Sheets and source backups.

Before new Supabase writes, rollback restores the recorded original frontend revisions (application baseline `df172e8`). After new writes, freeze and reconcile them back before rollback; never discard newly accepted data.

Validation uses isolated test keys and fictional data. Real Turnstile checks passed on both allowed hosts earlier; repeat after deployment. The production intake flag remains disabled during preparation.
