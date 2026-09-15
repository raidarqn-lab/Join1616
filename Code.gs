/**
 * Server 1616 Transfer Application backend.
 *
 * RECOMMENDED SETUP:
 * 1. Create a new Google Sheet.
 * 2. In that Sheet: Extensions > Apps Script.
 * 3. Replace the default code with this file.
 * 4. Run setupSheets() once and authorize it.
 * 5. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Copy the /exec URL into CONFIG.appsScriptUrl in app.js.
 */

const SHEETS = {
  APPLICATIONS: 'Applications',
  GROUPS: 'TransferGroups',
  MEMBERS: 'GroupMembers'
};

const APPLICATION_HEADERS = [
  'Timestamp', 'Application ID', 'Language', 'Current Server', 'Applicant Username', 'Applicant Alliance',
  'Profession Level', 'Kill Count', 'Hero Power', 'Building Power', 'Technology Power', 'Drone Power',
  'Unit Power (Top 3)', 'Overlord Power', 'Decoration Power', 'T11 Unlocked', 'Reported Transfer Score', 'Estimated Transfer Score Band',
  'Estimated Seat Colour', 'Seat Colour', 'Transfer With Group', 'Transfer Group Name',
  'Expected Additional Players', 'Known Players Listed', 'Expected Total Group Size', 'Unnamed / TBD Players',
  'Group Transfer Lead Username', 'Linked Player Names', 'Preferred 1616 Alliance', 'Referrer Username', 'Referrer Alliance', 'Comments', 'Status', 'Confirmation Code'
];

const GROUP_HEADERS = [
  'Timestamp', 'Transfer Group Name', 'Submitted By', 'Submitter Server', 'Submitter Alliance', 'Expected Additional Players',
  'Known Players Listed', 'Expected Total Group Size', 'Unnamed / TBD Players', 'Group Transfer Lead Username',
  'Applications Matched', 'Applications Outstanding', 'Status'
];

const MEMBER_HEADERS = [
  'Timestamp', 'Transfer Group Name', 'Submitted By', 'Submitter Server', 'Submitter Alliance', 'Role',
  'Player Name', 'Player Server', 'Player Alliance', 'Player Seat Colour', 'Matched Application ID', 'Match Status'
];

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, SHEETS.APPLICATIONS, APPLICATION_HEADERS);
  ensureSheet_(ss, SHEETS.GROUPS, GROUP_HEADERS);
  ensureSheet_(ss, SHEETS.MEMBERS, MEMBER_HEADERS);
  SpreadsheetApp.flush();
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, service: '1616-transfer-application' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    setupSheets();
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    validatePayload_(payload);
    if (payload.website) throw new Error('Spam check failed.');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const applications = ss.getSheetByName(SHEETS.APPLICATIONS);
    const groups = ss.getSheetByName(SHEETS.GROUPS);
    const members = ss.getSheetByName(SHEETS.MEMBERS);

    if (idExists_(applications, payload.applicationId)) {
      return json_({ ok: true, duplicate: true, applicationId: payload.applicationId });
    }

    const now = new Date();
    const groupMembers = Array.isArray(payload.groupMembers) ? payload.groupMembers : [];
    const groupLeadUsername = payload.transferWithGroup === 'yes' ? upperClean_(payload.groupLeadUsername) : '';
    const transferGroupName = payload.transferWithGroup === 'yes' ? clean_(payload.transferGroupName) : '';
    const knownPlayers = payload.transferWithGroup === 'yes' ? groupMembers.length : 0;
    const expectedRaw = digits_(payload.expectedAdditionalPlayers);
    const expectedAdditionalPlayers = payload.transferWithGroup === 'yes' && expectedRaw !== '' ? Number(expectedRaw) : '';
    const expectedTotalGroupSize = expectedAdditionalPlayers === '' ? '' : expectedAdditionalPlayers + 1;
    const unnamedPlayers = expectedAdditionalPlayers === '' ? '' : Math.max(expectedAdditionalPlayers - knownPlayers, 0);
    const linkedNames = groupMembers.map(m => `${clean_(m.name)} [${clean_(m.alliance)}] · ${digits_(m.server)}`).join(' | ');

    applications.appendRow([
      now,
      clean_(payload.applicationId),
      clean_(payload.language),
      digits_(payload.currentServer),
      clean_(payload.username),
      clean_(payload.alliance),
      digits_(payload.professionLevel),
      digits_(payload.killCount),
      digits_(payload.heroPower),
      digits_(payload.buildingPower),
      digits_(payload.technologyPower),
      digits_(payload.dronePower),
      digits_(payload.unitPower),
      digits_(payload.overlordPower),
      digits_(payload.decorationPower),
      clean_(payload.t11Unlocked),
      digits_(payload.reportedTransferScore),
      clean_(payload.estimatedTransferScoreBand),
      clean_(payload.estimatedSeatColour),
      clean_(payload.seatColour),
      clean_(payload.transferWithGroup),
      transferGroupName,
      expectedAdditionalPlayers,
      knownPlayers,
      expectedTotalGroupSize,
      unnamedPlayers,
      groupLeadUsername,
      linkedNames,
      clean_(payload.preferred1616Alliance),
      clean_(payload.referrerUsername),
      clean_(payload.referrerAlliance),
      clean_(payload.comments),
      'New',
      clean_(payload.confirmationCode)
    ]);

    // If this applicant was previously listed by someone else, link this new application automatically.
    matchApplicantToExistingGroups_(members, payload);

    if (payload.transferWithGroup === 'yes') {
      const groupRowNumber = findRowByValue_(groups, 2, transferGroupName);
      if (!groupRowNumber) {
        groups.appendRow([
          now,
          transferGroupName,
          clean_(payload.username),
          digits_(payload.currentServer),
          clean_(payload.alliance),
          expectedAdditionalPlayers,
          knownPlayers,
          expectedTotalGroupSize,
          unnamedPlayers,
          clean_(payload.groupLeadUsername),
          1,
          expectedTotalGroupSize === '' ? '' : Math.max(expectedTotalGroupSize - 1, 0),
          expectedTotalGroupSize === '' ? 'Group size not finalized' : (expectedTotalGroupSize > 1 ? 'Waiting for linked applications' : 'Complete')
        ]);
      } else {
        const currentExpected = groups.getRange(groupRowNumber, 8).getValue();
        const currentUnnamed = groups.getRange(groupRowNumber, 9).getValue();
        const currentContact = groups.getRange(groupRowNumber, 10).getValue();
        if (expectedTotalGroupSize !== '' && (!currentExpected || Number(currentExpected) < Number(expectedTotalGroupSize))) {
          groups.getRange(groupRowNumber, 6).setValue(expectedAdditionalPlayers);
          groups.getRange(groupRowNumber, 8).setValue(expectedTotalGroupSize);
        }
        if (unnamedPlayers !== '' && (!currentUnnamed || Number(currentUnnamed) < Number(unnamedPlayers))) {
          groups.getRange(groupRowNumber, 9).setValue(unnamedPlayers);
        }
        if (!currentContact && payload.groupLeadUsername) {
          groups.getRange(groupRowNumber, 10).setValue(clean_(payload.groupLeadUsername));
        }
      }

      if (!memberApplicationExists_(members, clean_(payload.applicationId))) {
        members.appendRow([
          now,
          transferGroupName,
          clean_(payload.username),
          digits_(payload.currentServer),
          clean_(payload.alliance),
          'Primary Applicant',
          clean_(payload.username),
          digits_(payload.currentServer),
          clean_(payload.alliance),
          '',
          clean_(payload.applicationId),
          'Matched'
        ]);
      }

      groupMembers.forEach(member => {
        if (!member.name || !member.server || !member.alliance) return;
        if (memberPersonExistsInGroup_(members, transferGroupName, member.name, member.server)) return;
        const existingApplication = findApplicationMatch_(applications, member.name, member.server);
        members.appendRow([
          now,
          transferGroupName,
          clean_(payload.username),
          digits_(payload.currentServer),
          clean_(payload.alliance),
          'Additional Player',
          clean_(member.name),
          digits_(member.server),
          clean_(member.alliance),
          '',
          existingApplication || '',
          existingApplication ? 'Matched' : 'Waiting for application'
        ]);
      });
    }

    recalculateAllGroupProgress_(groups, members);
    formatSheets_(ss);

    return json_({ ok: true, applicationId: payload.applicationId, transferGroupName: transferGroupName || '', groupLeadUsername: groupLeadUsername || '' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function validatePayload_(p) {
  const required = ['applicationId','confirmationCode','language','currentServer','username','alliance','professionLevel','killCount','heroPower','transferWithGroup'];
  required.forEach(k => { if (p[k] === undefined || p[k] === null || String(p[k]).trim() === '') throw new Error(`Missing required field: ${k}`); });
  ['currentServer','professionLevel','killCount','heroPower'].forEach(k => { if (!/^\d+$/.test(String(p[k]))) throw new Error(`${k} must contain digits only.`); });
  ['buildingPower','technologyPower','dronePower','unitPower','overlordPower','decorationPower','reportedTransferScore'].forEach(k => {
    if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '' && !/^\d+$/.test(String(p[k]))) {
      throw new Error(`${k} must contain digits only.`);
    }
  });
  if (String(p.seatColour || '') && !['gold','purple','blue','white','unknownSeat'].includes(String(p.seatColour))) throw new Error('Invalid seat colour.');
  if (!['yes','no','unsure'].includes(String(p.transferWithGroup))) throw new Error('Invalid transfer group answer.');
  if (p.transferWithGroup === 'yes') {
    if (!p.groupLeadUsername || !String(p.groupLeadUsername).trim()) throw new Error('Missing group transfer lead username.');
    if (!p.transferGroupName || !String(p.transferGroupName).trim()) throw new Error('Missing transfer group name.');
    if (p.expectedAdditionalPlayers !== undefined && p.expectedAdditionalPlayers !== null && String(p.expectedAdditionalPlayers).trim() !== '' && !/^\d+$/.test(String(p.expectedAdditionalPlayers))) {
      throw new Error('expectedAdditionalPlayers must contain digits only.');
    }
    if (!Array.isArray(p.groupMembers)) p.groupMembers = [];
    p.groupMembers.forEach((m, i) => {
      if (!m.name || !m.server || !m.alliance) throw new Error(`Incomplete group member ${i + 1}.`);
      if (!/^\d+$/.test(String(m.server))) throw new Error(`Invalid server for group member ${i + 1}.`);
    });
  }
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('|') !== headers.join('|')) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  return sheet;
}

function idExists_(sheet, id) {
  if (!id || sheet.getLastRow() < 2) return false;
  const ids = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  return ids.includes(String(id));
}


function findRowByValue_(sheet, columnIndex, value) {
  if (!value || sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  const target = normalize_(value);
  const idx = values.findIndex(v => normalize_(v) === target);
  return idx === -1 ? 0 : idx + 2;
}
function memberApplicationExists_(members, applicationId) {
  if (!applicationId || members.getLastRow() < 2) return false;
  const values = members.getRange(2, 11, members.getLastRow() - 1, 1).getDisplayValues().flat();
  return values.includes(String(applicationId));
}
function memberPersonExistsInGroup_(members, groupLeadUsername, playerName, server) {
  if (!groupLeadUsername || !playerName || !server || members.getLastRow() < 2) return false;
  const values = members.getRange(2, 1, members.getLastRow() - 1, MEMBER_HEADERS.length).getDisplayValues();
  const targetGid = normalize_(groupLeadUsername);
  const targetName = normalize_(playerName);
  const targetServer = digits_(server);
  return values.some(row => normalize_(row[1]) === targetGid && normalize_(row[6]) === targetName && digits_(row[7]) === targetServer);
}

function findApplicationMatch_(applications, playerName, server) {
  if (applications.getLastRow() < 2) return '';
  const values = applications.getRange(2, 1, applications.getLastRow() - 1, APPLICATION_HEADERS.length).getDisplayValues();
  const targetName = normalize_(playerName);
  const targetServer = digits_(server);
  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    if (normalize_(row[4]) === targetName && digits_(row[3]) === targetServer) return row[1];
  }
  return '';
}

function matchApplicantToExistingGroups_(members, payload) {
  if (members.getLastRow() < 2) return;
  const rows = members.getRange(2, 1, members.getLastRow() - 1, MEMBER_HEADERS.length).getValues();
  const targetName = normalize_(payload.username);
  const targetServer = digits_(payload.currentServer);
  const updates = [];
  rows.forEach((row, idx) => {
    const role = String(row[5]);
    const playerName = normalize_(row[6]);
    const playerServer = digits_(row[7]);
    const matchedId = String(row[10] || '').trim();
    if (role === 'Additional Player' && !matchedId && playerName === targetName && playerServer === targetServer) {
      updates.push(idx + 2);
    }
  });
  updates.forEach(rowNumber => {
    members.getRange(rowNumber, 11).setValue(clean_(payload.applicationId));
    members.getRange(rowNumber, 12).setValue('Matched');
  });
}

function recalculateAllGroupProgress_(groups, members) {
  if (groups.getLastRow() < 2) return;
  const groupRows = groups.getRange(2, 1, groups.getLastRow() - 1, GROUP_HEADERS.length).getValues();
  const memberRows = members.getLastRow() >= 2 ? members.getRange(2, 1, members.getLastRow() - 1, MEMBER_HEADERS.length).getValues() : [];
  const counts = {};
  memberRows.forEach(row => {
    const gid = normalize_(row[1]);
    if (!gid) return;
    const personKey = `${normalize_(row[6])}|${digits_(row[7])}`;
    if (!counts[gid]) counts[gid] = {};
    if (!counts[gid][personKey]) counts[gid][personKey] = { matched: false };
    if (String(row[10] || '').trim()) counts[gid][personKey].matched = true;
  });
  groupRows.forEach((row, i) => {
    const gid = normalize_(row[1]);
    const people = counts[gid] || {};
    const uniquePeople = Object.keys(people).length;
    const matched = Object.values(people).filter(p => p.matched).length;
    const expectedTotal = row[7] === '' ? '' : Number(row[7]);
    const outstanding = expectedTotal === '' ? '' : Math.max(expectedTotal - matched, 0);
    let status = 'Waiting for linked applications';
    if (expectedTotal === '') status = 'Group size not finalized';
    else if (outstanding === 0) status = 'Complete';
    groups.getRange(i + 2, 7).setValue(Math.max(uniquePeople - 1, 0));
    groups.getRange(i + 2, 11, 1, 3).setValues([[matched, outstanding, status]]);
  });
}

function formatSheets_(ss) {
  Object.values(SHEETS).forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const range = sheet.getDataRange();
    range.setVerticalAlignment('middle');
    sheet.getRange(1,1,1,sheet.getLastColumn()).setFontWeight('bold').setBackground('#0b1522').setFontColor('#e8f2f7');
    sheet.autoResizeColumns(1, sheet.getLastColumn());
    for (let c = 1; c <= sheet.getLastColumn(); c++) {
      if (sheet.getColumnWidth(c) > 260) sheet.setColumnWidth(c, 260);
    }
  });
}

function clean_(value) {
  const s = String(value == null ? '' : value).trim();
  // Prevent spreadsheet formulas if someone starts a text field with = + - or @.
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
}
function digits_(value) { return String(value == null ? '' : value).replace(/\D/g, ''); }
function upperClean_(value) { return clean_(String(value == null ? '' : value).toLocaleUpperCase()); }
function normalize_(value) { return String(value == null ? '' : value).trim().toLocaleLowerCase(); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
