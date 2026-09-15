# 1616 Server Transfer Application — v2

This version includes the full visual treatment in the HTML itself:

- Japanese-inspired hand-brushed **1616** vector wordmark (no font dependency)
- Samurai / sakura / blood-moon background illustration
- Six-stage application flow
- 8 languages: English, Spanish, Portuguese, French, Arabic, Vietnamese, Korean, German
- Arabic RTL layout
- Numeric validation for Kill Count and Hero Power
- Conditional transfer-group builder
- Google Apps Script backend for Google Sheets

## 1. Test the design
Open `index.html` in a browser. The background illustration and 1616 wordmark are embedded directly in the file, so they should appear even when the file is opened locally.

## 2. Create the Google Sheet
Create a new Google Sheet for the applications. The Apps Script can create the required tabs/headers.

## 3. Add the Apps Script
In the Sheet:
1. Extensions → Apps Script
2. Replace the starter code with the contents of `Code.gs`
3. Save
4. Deploy → New deployment
5. Type: Web app
6. Execute as: Me
7. Who has access: Anyone
8. Deploy and copy the `/exec` URL

## 4. Connect the site
Open `index.html` and find the `APPS_SCRIPT_URL` constant near the JavaScript section. Replace the placeholder with the `/exec` URL from Google Apps Script.

## 5. Host on GitHub Pages
Upload `index.html` to your GitHub repository, then enable GitHub Pages under:
Settings → Pages → Deploy from a branch.

The site is fully self-contained, so you do not need to upload fonts or background image files.

## Transfer groups
Group member names are optional. If an applicant is transferring with others but does not know all names yet, they can select **Yes** and continue without adding players.

They can optionally:
- enter an estimated number of additional players;
- add any known player using player name + server + alliance;
- leave unknown players unlisted for now.

The Google Sheet stores expected group size separately from the number of known players listed, so the review team can see that a group may be larger than the named-player list.


## Shared Transfer Group IDs
When an applicant selects **Yes** for transferring with a group, the form now generates a **Transfer Group ID**.
- The first applicant can share that ID with friends.
- Later applicants can paste the same ID into the form.
- The backend groups those applications together in the `TransferGroups` and `GroupMembers` sheets.


## Assets required on GitHub
Make sure these files are uploaded at the same level as `index.html`:
- `blood_moon_samurai_valley.png`
- `wordmark-1616.png`

The page now also includes a visible sakura petal animation layer and seat colour for each linked transfer-group member.


## v9 GitHub deployment fix
The background image and 1616 wordmark are embedded directly inside `index.html` as data URIs.
You no longer need separate image files for the website to display correctly on GitHub Pages.

The previous build also had the background scene behind the body's opaque background because of a negative z-index.
This version fixes the stacking order, which also makes the floating sakura petals visible.


## v10: S4 transfer estimate fields
Step 3 now collects optional transfer-score inputs:
- Building Power
- Technology Power
- Drone Power
- Unit Power for the top 3 fully deployed squads
- Overlord Power
- T11 status
- Known in-game Transfer Score, if already visible

The page estimates an end-of-S4 seat colour using rough historical THP reference thresholds (110M / 165M / 220M)
with a ±10M borderline zone. It also displays an experimental transfer-score band. These are planning estimates only;
the game does not publish a universal formula and thresholds vary by transfer group.


## v12 fix
v11 contained a JavaScript syntax error in the multilingual translation object, which prevented the Continue button from running.
v12 rebuilds the help guide from the working v10 base and syntax-checks the script before release.

Step 3 also now includes an expandable “Where do I find these power numbers?” guide plus short in-game navigation breadcrumbs.


## v13 Welcome Page
A full-screen welcome page now appears before Step 1 of the application.
It introduces the 1616 transfer guides with circular profile images:
- Yabadabadoo [WaE]
- TravelAgentDolph [PX1]
- RaidARQN [NvSP]

The three guide images are embedded directly into `index.html`, so GitHub Pages does not need separate avatar image files at runtime.


## v15
- Welcome begins with language selection, then shows the transfer guides in the chosen language.
- Middle guide corrected to Dolphy RN BE [NvEM].
- Portrait frames use a pulsing red glow.
- Begin Application is localized and pink/red.
- Progress numbers have no surrounding circles.
- Completed steps receive a fast red samurai-sword slash with a brief spark/streak at the cut tip.


## v16
- Corrected Dolphy RN [NvEM].
- Removed “SERVER TRANSFER APPLICATION” from the 1616 image asset; the subtitle is now text-only and therefore translates with the interface.
- Step 3 no longer calculates or displays a transfer score or seat-colour estimate.
- Added an explanation that the raw account-development data is collected because confirmed Transfer Score / seat colour may not yet be available at application time.
- Applicant seat colour can be left unconfirmed.
- Added a final confirmation screen with a unique user-facing confirmation code.
- Confirmation code is submitted to the Google Sheet.
- Confirmation page supports Copy Code and Save Confirmation PNG.


## v17
- Removed the repeated Language step from the form. Language is selected in the opening overlay only; the header language control remains available if the user wants to change it.
- Application is now 5 steps: Your Information, Game Details, Transfer Group, Additional Information, Review & Submit.
- Added a Clear Form control that is visible on every application step.
- Clear Form opens a confirmation dialog warning that all entered form data will be cleared.
- Added optional 1616 alliance placement preference with a clear no-guarantee placement notice.
- Added optional referral fields for referrer username and alliance/tag.
- Preferred alliance and referral data are included in the review screen and Google Sheet.


## v18
- Fixed a v17 step-numbering regression that caused all five form screens to display as Step 1 at the same time.
- Restored the intended five-screen flow:
  1. Your Information
  2. Game Details
  3. Transfer Group
  4. Additional Information
  5. Review & Submit
- Added Decoration Power to Transfer Planning Information.
- Decoration Power is submitted to the Google Sheet as its own column.


## v19
- Transfer Planning Information is now a collapsed optional section by default.
- The summary explicitly states that applicants may skip the entire section and continue.
- The optional section expands/collapses on demand to keep Game Details shorter and less cumbersome.
- Removed repetitive “Optional” labels from each field inside that section because the whole section is already clearly optional.


## v20
- Reworked Transfer Group ID into two clearly separated choices:
  1. Start a new transfer group and share the newly generated ID.
  2. Join an existing transfer group by pasting a shared ID received from another player.
- Added an explicit “OR” divider and separate teal/pink visual treatments.
- Added a live status row showing exactly which Group ID the application will use and whether it is NEW or SHARED.
- The generated new ID stays visible even when a shared ID is entered, but is clearly marked as not being used.


## v21
- Replaced the upper-right helper next to the language dropdown with “Choose a language”.
- That helper now changes dynamically with the selected language.


## v22
- Removed the custom/generated Transfer Group ID system.
- Applicants transferring with a group now enter their Group Transfer Lead's in-game username.
- The Group Transfer Lead field automatically converts entries to ALL CAPS.
- The form explicitly tells applicants that everyone in the same group should enter the same lead username.
- Group applications are now linked in Google Sheets using the normalized Group Transfer Lead username.
- Removed the separate Group Contact selector; the Group Transfer Lead is now the group identifier/contact reference.
- Confirmation and review screens now show the Group Transfer Lead instead of a Transfer Group ID.


## v23
- “Add a player you know” now asks only for username, alliance name, and server number.
- Removed seat colour from known-player cards and group-member review display.
- Added a required, user-created Transfer Group Name for anyone transferring as a group.
- Transfer leads are prominently told to create one memorable, unique group name, not use their alliance name, and share the exact name with everyone in the group.
- Non-leads enter the exact Transfer Group Name shared by their lead.
- The form rejects a Transfer Group Name that exactly matches the applicant's alliance name.
- Transfer Group Name appears in the review and confirmation page.
- Google Sheets now groups group applications by Transfer Group Name, while separately storing the Group Transfer Lead username.


## v24
- Removed the Group Transfer Lead username question.
- Removed the ALL CAPS conversion notice and lead-username instructions.
- Transfer Group Name is now the only shared identifier used to link applications from the same group.
- Review, confirmation, and backend submission no longer require a transfer lead username.


## v25
- Made Player 1 / Player 2 / Player 3 labels visually distinct from the rest of the form.
- Player labels now use a pink/red pill badge with bright white text and stronger weight.
- Added a subtle pink/red accent strip to each known-player card.


## v26
- Increased visual differentiation of the optional confirmed seat-colour choices.
- Gold, Purple, Blue, and White now have colour-tinted borders/backgrounds even before selection.
- Selected seats use a stronger colour-matched fill, glow, and radio indicator.
- “Not confirmed yet” remains neutral so the actual seat colours are easier to scan.


## v27
- Restyled the final waitlist reminder as a prominent alert.
- Added a warning icon on the left side.
- The alert now uses a stronger pink/red border, accent strip, and warning treatment while preserving the existing translated text.


## v28
- Transfer Group Name is now forced to ALL CAPS in the UI, payload, and backend.
- Applicant Current Server is now a dropdown limited to servers 1573–1636.
- “Add a player you know” server selection is also a dropdown limited to 1573–1636.
- Backend validation rejects servers outside 1573–1636.
- Referrer Alliance is now a dropdown containing the supplied Server 1616 alliance list.
- Added “Other / not listed” as a fallback because one alliance rank in the source list was obscured and no name was supplied.


## v29
- Replaced the three separate transfer-guide portraits on the welcome screen with the supplied group image.
- Kept the three guide usernames visible in a dedicated name strip below the photo:
  - Yabadabadoo [WaE]
  - Dolphy RN [NvEM]
  - RaidARQN [NvSP]
- Added a coordinated pink/red + teal frame so the image fits the existing 1616 welcome design.


## v30
- Updated the welcome guide sentence to: “We are here to support the transfer application process for the server.”
- Updated the same message across all supported interface languages.


## v31
- Reduced the welcome-screen group photo to roughly 25% of its previous desktop size.
- Kept the three guide username/alliance labels at a readable width below the smaller centered image.


## v32
- Welcome-screen guide names no longer look like clickable buttons.
- Added comic-book hover animations to each guide label:
  - Yabadabadoo → “Calm, Cool, Collected”
  - Dolphy RN → “Mr. Personality”
  - RaidARQN → “Pew Pew queen of 1616”
- Hover bubbles pop in like comic speech captions with playful scaling/rotation.
