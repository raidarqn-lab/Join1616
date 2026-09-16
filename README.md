# 1616 Server Transfer Application v74

Includes the Dolphy support-agent question widget header, Discord/not-live-chat messaging, and all previous v72 viewport fixes.

# v72 viewport/layout fix

This build keeps the welcome screen and floating Questions panel fully within the browser viewport. The welcome card is slightly wider and height-responsive, and the Questions panel now sits above the persistent header/language controls with a viewport-safe maximum height.

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


## v33
- Added the Google Font “Bungee Tint”.
- Applied Bungee Tint to the main page title at the top of each of the five application steps.
- Welcome-screen and other headings remain unchanged.


## v34
- Replaced the Transfer Planning expand/collapse chevron with a filled triangle.
- The triangle points right when the optional section is closed and rotates downward when the section is open.
- Added a subtle pink hover glow so the expand control is easier to recognize.


## v35
- Added a samurai-themed CSS animation to the main title whenever the user moves to a different application step.
- The Bungee Tint title now reveals rapidly like an ink/blade cut, followed by a red katana slash and a small travelling spark.
- Animation plays only on actual step changes, not ordinary language refreshes.
- Added reduced-motion support for accessibility.


## v36
- Replaced the numbered/slashed left-side progress indicators with five Blood Moon phases.
- The phases progress from a thin red crescent at Step 1 to a full Blood Moon at Step 5.
- The current step receives a subtle red halo and a short “moon awakening” animation when it becomes active.
- Future moons are dimmed; completed moons remain visible but restrained.
- Added a subtle vertical red progression line behind the moons.
- Existing step labels, fonts, typography, and form layout were left unchanged.


## v37
- Reworked the form’s binding boxes from blue/teal to glowing pink/red to better match the Sakura and Blood Moon theme.
- Updated the main form panel, form fields, generic choice cards, grouped information cards, transfer-planning containers, group cards, referral/preference cards, review sections, and footer/action borders.
- Added restrained pink/red outer glows rather than heavy neon effects.
- Preserved the existing Gold, Purple, Blue, and White seat-colour identities.
- Blood Moon progress phases, Bungee Tint step titles, and existing typography remain unchanged.


## v38
- Changed the welcome-page “Thank you for your interest in joining 1616!” heading to use the same Bungee Tint font as the five step titles.
- Other welcome-page typography remains unchanged.


## v39
- Changed the welcome heading to the regular Google Font “Bungee” for better readability.
- Welcome heading is now solid white with a subtle pink/red glow.
- Step titles remain in Bungee Tint.


## v40
- Reduced the Bungee welcome-heading size so “Thank you for your interest in joining 1616!” wraps more cleanly.
- Increased line-height to prevent Bungee glyphs from visually colliding across lines.
- Slightly widened the title area and enabled balanced wrapping.


## v41
- Redesigned the welcome guide screen to feel more samurai/clan-themed.
- Added a Japanese-style title treatment:
  - white Bungee headline
  - subtle ink/katana underline slash
  - small red hanko-style “1616” seal beside the heading
- Restyled guide names into dark clan-style nameplates with a red vertical accent and alliance underneath.
- Added a cinematic welcome-sequence animation on the guide screen:
  - guide stage fades in
  - Blood Moon glow brightens behind the title
  - headline reveals
  - katana underline flashes
  - guide portrait rises/fades in
  - nameplates appear one after another
  - Begin Application appears last
- The sequence is timed to complete in roughly 1.2–1.5 seconds and includes reduced-motion support.


## v42
- Replaced the single welcome image with three separate guide images (Yabadabadoo, Dolphy RN, RaidARQN).
- Added a Spider-Man-inspired welcome composition where the guides animate in one after another and visually point toward each other.
- Created cropped local image assets for each guide to support the welcome-screen animation.
- Preserved the clan-style nameplates, comic hover captions, and samurai/Blood Moon title treatment.


## v43
- Replaced the temporary welcome-screen cropped images with regenerated transparent character cutouts.
- The welcome scene now uses Yabadabadoo on the left, Dolphy RN in the center, and RaidARQN on the right.
- The characters now point naturally in their own poses, so no extra synthetic pointer bars are used.
- Kept the sequential welcome animation and existing nameplate layout.


## v44
- Restyled all dropdown/select fields to match the Blood Moon / Sakura form theme.
- Replaced the browser-grey closed select appearance with a dark navy/crimson gradient.
- Added pink/red borders, glow, hover/focus states, and a custom pink chevron.
- Styled native option lists dark with white text where the browser supports option styling.
- Updated the header language dropdown to match.


## v45
- Changed the welcome copy to: "We are your chaotic 1616 transfer team Yabadabadoo [WaE], Dolphy RN [NvEM], and RaidARQN [NvSP]."
- Removed the name labels from underneath the welcome images so the screen no longer looks like users need to choose a guide.
- Kept the welcome-screen trio images and animation intact.


## v46
- Reworked the welcome-screen guide images on mobile so they no longer stack vertically.
- Yabadabadoo and Raid now sit lower left/right with Dolphy centered above them in a compact triangular composition.
- Reduced guide image sizes and mobile glow sizes.
- Added an extra-small-phone layout so the welcome screen requires substantially less scrolling.


## v47
- Replaced visible native dropdown controls with fully custom dropdown components.
- This fixes the stock grey expanded menu that some browsers/operating systems force on native `<select>` elements.
- The new open menus are dark navy/crimson with pink/red borders, glow, selected-state accents, and themed scrollbars.
- The original selects remain in the DOM so existing application values, validation, translations, and Google Sheet submission logic continue to work.
- Custom dropdowns also support dynamically added transfer-group player server selectors and changing group-contact options.


## v48
- Personalized the Step 2 heading using the username entered on Step 1.
- English example: “Hi, RaidARQN. Tell us more about yourself!”
- Added localized personalized versions for all eight supported languages.
- The heading updates automatically if the username or language changes.
- Reduced only this longer Step 2 title slightly so it wraps cleanly while keeping the existing Bungee Tint step-title styling and samurai animation.


## v49
- Replaced the top-right language selector’s old circle/globe symbol with a minimalist sakura icon.
- The new icon is rendered as a small inline SVG in the existing pink Blood Moon palette.
- Added a subtle hover/focus animation so the sakura feels integrated with the form styling without becoming distracting.


## v50
- Shifted the application UI away from blue/teal to a red, sakura pink, and lantern-gold palette.
- The top-left “SERVER TRANSFER APPLICATION” label is now pink/red.
- Warmed panels, fields, borders, progress elements, help states, dropdowns, and action areas so the visible UI no longer uses teal accents.
- Step titles now use regular Bungee in lantern gold instead of the colour-font treatment, avoiding unwanted cool tones.
- Implemented the Blade-draw Continue button:
  - dark red/charcoal default
  - red-to-lantern-gold blade line draws underneath on hover/focus
  - arrow slides forward
  - a quick slash flashes across the button on a valid click before advancing
- Added a required-field reminder popup at the top:
  - greets the applicant by username
  - says it looks like they missed something
  - lists the actual question text for each missing/invalid required field
  - supports required fields, the Step 3 group choice, Transfer Group Name, and partially completed known-player cards
  - scrolls the first invalid area into view
  - closes when the applicant starts correcting the form
- Added localized popup greetings for all eight supported languages.


## v51
- Restyled the main application area to feel more like a glowing lantern.
- Added warm amber/red layered gradients to the form panel.
- Added soft internal highlight washes, a subtle glowing inner frame, and a gentle halo behind each step heading.
- Warmed the inner cards, input fields, and action bar so the whole form feels illuminated from within instead of flat.
- Preserved the existing red / sakura / lantern-gold palette and Continue-button behavior from v50.


## v52
- Added a Transfer Group reminder popup that appears before proceeding from Step 3 to Step 4 when the applicant is transferring with a group.
- The popup greets the applicant by username and reminds them to save their Transfer Group Name to share with friends.
- The Transfer Group Name is displayed very large in a central coupon-style dashed box with glowing text.
- Added a Copy Group Name button that copies the Transfer Group Name to the clipboard.
- The Continue button inside the popup stays disabled until the applicant presses Copy.
- If the Transfer Group Name changes, the reminder will be shown again before proceeding.


## v53
- Fixed the top-right language selector opening behind the main application area.
- Raised the header and language selector into a higher stacking context.
- Forced the header/language wrappers to allow overflow so the dropdown is not clipped.
- Increased the language menu z-index on desktop and mobile.


## v54
- Replaced the top-left `1616` wordmark image with a transparent-background version.
- This removes the dark/black box behind the logo so it sits cleanly over the page background.


## v55
- Fixed the 1616 wordmark transparency issue at the source.
- The site was still displaying an old embedded base64 copy of the logo, so replacing `wordmark-1616-only.png` alone did not affect what appeared on screen.
- Both header and sidebar wordmarks now reference the transparent `wordmark-1616-only.png` file directly.
- Added explicit transparent background rules to the wordmark image and its immediate containers.


## v56
- Fixed the stubborn 1616 logo background by changing the asset filename entirely.
- The transparent PNG is now `wordmark-1616-transparent-v56.png`, which prevents browsers/GitHub Pages from reusing a cached older logo with a dark background.
- Both the header and sidebar use the new filename.
- Removed the old `wordmark-1616-only.png` from the package to prevent accidental reuse.
- Added explicit `background: none` / transparent rendering safeguards to the logo and immediate wrappers.


## v57
- Standardized every optional marker to use parentheses and italics.
- English now displays `(Optional)` everywhere instead of `Optional` / `OPTIONAL`.
- Applied the equivalent parenthesized treatment to all supported languages.
- Updated the Transfer Planning explanatory note so its optional designation also appears in parentheses and italics.


## v58
- The Transfer Group reminder popup no longer forces applicants to copy the group name before proceeding.
- The Continue button is available immediately.
- Copy Group Name remains available and still changes to “Copied!” when used.
- Updated the reminder copy so copying is encouraged rather than required.


## v59
- Replaced the `◎` icon beside “Transfer Group Name” with the sakura-style `✿` symbol.
- Added a subtle pink/lantern-gold glow so it fits the existing visual theme.


## v60
- Improved visual differentiation between the sections on the Transfer Group page.
- The main section cards now use distinct themed shades instead of feeling uniformly red:
  - Transfer Group Name / lead area: rose-red
  - Group contact / shared details area: warm lantern-gold
  - Summary area: plum-violet
  - Dynamically added player cards: cool plum-slate
- Added subtle left accent bars and heading tint differences to help each section read as a separate block more clearly.


## v61
- Reworked Transfer Group section styling again:
  - removed the different card colours from v60
  - all cards now use one consistent warm charcoal/burgundy shade
  - retained the stronger left-edge accent bar because it improves section separation
  - increased contrast between cards and the main application background
- Added validation:
  - applicant alliance tag: maximum 4 characters, without brackets
  - maximum total transfer group size: 100 including the applicant (so additional players max at 99)
  - profession level: maximum 100
  - total kill count: maximum 9 digits
- Added matching backend validation in `Code.gs` so invalid values cannot bypass the frontend.


## v64
- Replaced the stats guide image with the corrected version where the arrow clearly runs from #1 Total Power to #4 Power Details.
- Added multilingual HTML overlays directly inside the guide image: four translated labels plus four translated instructions.
- Overlay text changes automatically with the application's selected language (EN, ES, PT, FR, AR, VI, KO, DE).
- Hid the duplicate caption grid and reduced the modal footprint.


## v65
- Removed the awkward “Uses a sample profile with fake data so it works in every language” sentence beside the visual-guide button.
- Converted the missing-required-fields warning from a top banner into a centered, full-screen modal overlay so it cannot be cut off by the site header.
- Raised the welcome screen above the persistent header/language controls so the landing experience is always the foremost layer.


## v66
- Rebuilt the Sample Visual Guide popup as a horizontal layout.
- Removed all translated HTML text from on top of the image.
- The image now sits on the left and the user's selected-language instructions sit in a dedicated panel on the right.
- The image is visually cropped to the useful profile/Power Details portion so the old empty caption area is not shown.
- On smaller screens the layout stacks responsively for readability.

## v69
- Replaced the stats visual guide image with the finalized diagram-only version.
- The diagram uses: (1) Total Power, (2) Profession Level, (3) Kill Count, and (4) Power Details.
- Added final native-language instructions for all 8 supported languages beside the image.
- Clarified that users tap area (1) to open screen (4).
- Restyled the Close button for readability.


## v69 visual guide update
The stats guide now uses an accordion on the right: one numbered instruction expands at a time. The bottom Close button was removed; the top-right close control displays the localized Close label beside the X.


## v71 — Floating question widget + Discord notifications

This version adds a small **Questions?** button in the bottom-right corner of the application. It is a question form, not live chat.

When opened, the widget automatically pulls the applicant's current:
- in-game username
- server
- alliance tag
- current application step
- selected application language

The applicant chooses a category, writes a question, and can optionally provide an email address for a reply. The question is sent to the **same Google Apps Script Web App URL** already used for applications.

### Questions sheet
Run `setupSheets()` again after replacing Code.gs. It will create a new **Questions** tab with:
- Timestamp
- Question ID
- Username
- Server
- Alliance
- Category
- Question
- Contact Email
- Application Step
- Application Step Label
- Language
- Status
- Discord Notification

### Discord setup
Do **not** place your Discord webhook URL inside `index.html`.

In Discord:
1. Create or choose a private channel such as `#transfer-questions`.
2. Open the channel settings / integrations and create a webhook.
3. Copy the webhook URL.

In Google Apps Script:
1. Open **Project Settings**.
2. Under **Script properties**, add:
   - Property: `DISCORD_WEBHOOK_URL`
   - Value: your Discord webhook URL
3. Optional: to ping one Discord role on every question, add:
   - Property: `DISCORD_MENTION_ROLE_ID`
   - Value: the numeric Discord role ID
4. Save the properties.
5. Replace your deployed Apps Script code with this version of `Code.gs` and create a new deployment/version so the live `/exec` endpoint uses the new code.

If the webhook is not configured, questions are still saved to the **Questions** sheet; the `Discord Notification` column will say `Webhook not configured`.


## v74 visual update
- Transfer Group page uses refined Option C accent bars.
- Estimated Group Size now has a hashtag (#) icon.
- Player 1 / Player 2 / Player 3 badges use glowing gold with dark text.
- Transfer-lead information alert is now a high-contrast gold callout.
- Step 3 validation highlights use amber/gold outlines and glow instead of flooding fields with red.


## v75 support widget asset
- `dolphy-support-agent.png` — transparent Dolphy support-agent badge used by the floating Questions widget and confirmation state.

## v78 Step 3 assets and server dropdowns
The Transfer Group page includes three exported PNG assets that are used directly by the website:
- `transfer-group-icon.png` — group / army icon
- `group-size-icon.png` — crossed swords arranged as a hashtag
- `player-helmet-icon.png` — samurai helmet used for the Group Members section and beside each Player badge

Each player card keeps Username, Alliance name, and Server number. Server number uses a native dropdown (1573–1636) so the option list remains visible above surrounding cards.


## v79 update
- Replaced transfer group section icons with simpler minimalist exported icon assets.
- Tuned icon containers and player label icon sizing for better readability at smaller sizes.
- Preserved native visible server dropdowns in the player cards.

## v80 Step 3 design
- Applies the selected Option C colour treatment: dark eggplant panels with lantern-amber accents.
- Simplifies duplicate Step 3 helper copy.
- Uses optimized minimalist icon PNGs stored directly in the website root.
- Keeps the native player server dropdown so server choices remain visible over the cards.


## v81 update
- Moved all Transfer Group icon PNGs to the website root.
- Updated every HTML reference so no `assets` or `icons` folder is required.

## v82 Additional Information update
- 1616 Alliance Preference now uses the same alliance dropdown options as Referrer's alliance / tag.
- Added a conditional Yes / No / Unsure question for group applicants asking whether all group members need to be in the same alliance.
- The new answer is included in the application payload and Review & Submit screen.

## v83 About 1616 page
- Added a new welcome-flow page called **About 1616** between language selection and the welcome/team page.
- Built a milestone-style journey layout with footprint path visuals and five placeholder milestone cards.
- Added five new root-level visual assets for the milestone journey:
  - about-journey-torii.png
  - about-journey-moon.png
  - about-journey-castle.png
  - about-journey-katanas.png
  - about-journey-sakura.png
- Added translation keys for the About 1616 page across all supported languages.

## v84 About 1616 season milestones
- Replaced the generic milestone placeholders with Pre-Season through Season 5.
- Added the season mechanics provided for each milestone.
- Added a separate 1616 Story placeholder on every card for server-specific history to be filled in later.
- Updated the About page content across all eight supported languages.

## v85 standalone 1616 Story page
- Removed the season journey from the initial welcome sequence.
- Added a persistent top navigation menu with **Application** and **1616 Story**.
- 1616 Story is now its own full page beneath the persistent site header.
- The language selector remains available while viewing either page.
- Language selection now proceeds directly to the transfer-team welcome screen, then into the application.

## v86 Story page fix
- Renamed the English page/navigation label to **1616's Story**.
- Fixed the standalone Story page so the transfer application is completely removed from the layout while Story is open.
- Added both CSS and JavaScript safeguards so the application cannot appear underneath the Story timeline.

## v87 update
- The **1616's Story** page now reveals the timeline footprints progressively as you move through the milestones.
- Footprints no longer all appear at once.
- Added milestone-based scroll animation and stepped footprint transitions.

## v88 — interactive editorial Story redesign
- Rebuilt **1616's Story** to closely follow the approved Japanese editorial timeline mock-up.
- Added six new transparent season illustrations directly to the website root:
  - `story-season-s0.png`
  - `story-season-s1.png`
  - `story-season-s2.png`
  - `story-season-s3.png`
  - `story-season-s4.png`
  - `story-season-s5.png`
- Kept `story-design-reference.png` in the package as a visual reference.
- Story milestone cards are interactive: **Tap to expand** opens a 1616-specific placeholder area.
- Progressive timeline footprints from v87 are retained.
- Reworked the main navigation to **1616's Story / World / Characters / Media / Application**, with an underline showing the active page.
- World, Characters, and Media are functional placeholder pages for future content.

## v89 — story page visual redesign
- Restyled **1616's Story** as a centered, rounded story container that more closely matches the approved story mock-up.
- Added a soft background treatment using `story-design-reference.png` inside the story container.
- Changed content pages so the main website background fades to dark gray / black behind the story container.
- Updated World / Characters / Media placeholder pages to use the same modal-style container treatment.

## v90 — History navigation and page transition update
- Top navigation now contains only **1616 History** and **Application**.
- The History page uses the exact same 1616 logo artwork and subtitle treatment as the main application header.
- The History content window now uses a lighter warm taupe / ivory palette based on the approved reference design.
- The site behind the History window fades to charcoal / dark gray.
- Added a smooth fade-and-lift transition when switching between Application and 1616 History.
- Removed the World, Characters, and Media placeholder pages from the navigation.

## v91 — History page copy hierarchy
- Updated the History hero to:
  - **A SERVER BOUND FOR SUCCESS**
  - **1616's STORY**
  - **Four Seasons. Now is Your Chance to Be A Part of History.**
- Removed repeated season naming inside every timeline card.
- Each card now uses a small red **Season X** label and a larger season-name heading.
- Example: **SEASON 0** → **PRE-SEASON**.
- Updated the same hierarchy across all supported languages.

## v92 — Pre-Season and Crimson Plague story copy
- Added cinematic chapter headings:
  - **The Dawn of 1616**
  - **The Virus Arrives**
- Replaced the generic Pre-Season summary with the new Server 1616 opening story.
- Pre-Season's expandable 1616 Story now contains the completed first chapter.
- Replaced the Crimson Plague summary with the new narrative, including the sneak-attack virus bomb memory.
- Crimson Plague's expandable **1616's Story** remains a placeholder.
- Removed People / Moments / Legacy from Pre-Season and Crimson Plague only.
- Seasons 2–4 remain unchanged.

