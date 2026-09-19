# Connect applications to Google Sheets

1. Create a blank Google Sheet (or open the intended destination).
2. Choose **Extensions → Apps Script**.
3. Replace the starter code with the complete contents of **Code.gs** in this folder, and save.
4. Select **setup** from the function menu and click **Run**. Authorize it with the Google account that owns the sheet. It creates Applications and Questions tabs without clearing existing data; incompatible existing headers are rejected.
5. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then deploy. If your organization does not allow Anyone, an administrator or a different account is needed.
6. Copy the deployed web app URL ending in **/exec** (not /dev).
7. In **index.html**, replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL, leaving the surrounding quotes in place. You can send that URL back to me to complete this step.
8. Upload the updated site files to your existing host.
9. Submit a test application from the hosted site in a signed-out/private browser window. Confirm that exactly one row arrives in Applications and that the confirmation screen appears. Test a group application too; groupMembers stores the supplied player list as JSON in one cell. Questions go to the Questions tab.

The spreadsheet can stay private: applicants only use the submission endpoint. Reviewers should be granted access separately. The endpoint accepts public submissions, so it is not spam-proof.

The updated form reads Google's response before showing success. A timeout or unreadable response leaves the draft available for retry. Application IDs prevent duplicate application rows on retry. Questions do not have duplicate detection. All submitted application fields, including language, group name and reference code, are retained.

If you edit Code.gs later, use Deploy → Manage deployments → Edit → New version → Deploy. Keep the same deployment URL.

Prepared locally; a live Google deployment and a successful real submission are still required to verify the connection. This guide supersedes the older Google setup notes in README.md. No Google Sheet was created or modified while preparing this package.

Official deployment documentation: https://developers.google.com/apps-script/guides/web
