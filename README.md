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

## Latest visual update

- The top-left header now shows the **1616 wordmark only**; the repeated “Server Transfer Application” label has been removed.
- The decorative character beside each step heading has been replaced with a **sakura blossom icon** so the interface is visual rather than language-specific.
