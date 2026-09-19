// Paste into Extensions > Apps Script in the destination Google Sheet.
// Run setup once, then deploy as a web app: Execute as Me; access Anyone.
const APPLICATION_FIELDS = ["applicationId", "confirmationCode", "transferGroupName", "language", "currentServer", "username", "alliance", "professionLevel", "killCount", "heroPower", "buildingPower", "technologyPower", "dronePower", "unitPower", "overlordPower", "decorationPower", "t11Unlocked", "reportedTransferScore", "estimatedSeatColour", "estimatedTransferScoreBand", "seatColour", "transferWithGroup", "expectedAdditionalPlayers", "groupMembers", "preferred1616Alliance", "groupSameAlliance", "referrerUsername", "referrerAlliance", "comments", "clientTimestamp"];
const QUESTION_FIELDS = ['username', 'currentServer', 'alliance', 'category', 'question', 'contactEmail', 'applicationStep', 'applicationStepLabel', 'language'];

function setup() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Open Apps Script from the destination Google Sheet.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', book.getId());
  prepareSheet_(book, 'Applications', ['receivedAt'].concat(APPLICATION_FIELDS));
  prepareSheet_(book, 'Questions', ['receivedAt'].concat(QUESTION_FIELDS));
}

function prepareSheet_(book, name, headers) {
  let sheet = book.getSheetByName(name);
  if (!sheet) sheet = book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (JSON.stringify(existing) !== JSON.stringify(headers)) {
    throw new Error('Unexpected columns in ' + name + '. Use a new empty sheet or restore the original headers.');
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 100000) throw new Error('Missing or oversized submission.');
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Invalid submission.');
    if (p.website) throw new Error('Submission rejected.');
    const isQuestion = p.requestType === 'question';
    if (p.requestType && !isQuestion) throw new Error('Unknown request type.');
    const fields = isQuestion ? QUESTION_FIELDS : APPLICATION_FIELDS;
    const required = isQuestion ? ['category', 'question'] : ['applicationId', 'username', 'currentServer'];
    required.forEach(function(key) {
      if (typeof p[key] !== 'string' || !p[key].trim()) throw new Error('Missing ' + key);
    });
    fields.forEach(function(key) {
      if (key === 'groupMembers') return;
      if (p[key] != null && typeof p[key] !== 'string' && typeof p[key] !== 'number') throw new Error('Invalid ' + key);
      if (String(p[key] == null ? '' : p[key]).length > 10000) throw new Error('Field too long: ' + key);
    });
    if (!isQuestion && (!Array.isArray(p.groupMembers) || p.groupMembers.length > 200)) throw new Error('Invalid group members.');
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) throw new Error('Run setup before accepting applications.');
    lock.waitLock(20000);
    const book = SpreadsheetApp.openById(id);
    const sheet = prepareSheet_(book, isQuestion ? 'Questions' : 'Applications', ['receivedAt'].concat(fields));
    // An application keeps its ID on retry so a lost response cannot create duplicate rows.
    if (!isQuestion && sheet.getLastRow() > 1) {
      const duplicate = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1)
        .createTextFinder(p.applicationId).useRegularExpression(false).matchEntireCell(true).findNext();
      if (duplicate) return json_({ok: true, applicationId: p.applicationId, duplicate: true});
    }
    sheet.appendRow([new Date().toISOString()].concat(fields.map(function(key) { return safeCell_(p[key]); })));
    SpreadsheetApp.flush();
    return json_({ok: true, applicationId: p.applicationId || ''});
  } catch (err) {
    console.error(err);
    return json_({ok: false, error: 'Unable to save. Please retry or contact the transfer team.'});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function safeCell_(value) {
  const text = value == null ? '' : (typeof value === 'object' ? JSON.stringify(value) : String(value));
  if (text.length > 45000) throw new Error('Field too long.');
  // Keep visitor-supplied text from being evaluated as a spreadsheet formula.
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
