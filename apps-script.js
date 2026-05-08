// ============================================
// Google Apps Script — Digital Privacy is a Myth*
// ============================================
// INSTRUCTIONS:
// 1. Open Google Sheets and create a new spreadsheet
// 2. Create 5 tabs: "readers", "waitlist", "feedback", "download_log", "_config"
// 3. Go to Extensions > Apps Script
// 4. Paste this entire file into the script editor
// 5. Deploy > New deployment > Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy the deployed URL and paste it into shared.js (APPS_SCRIPT_URL)
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var type = data.type;
    var timestamp = new Date().toISOString();

    if (type === 'download') {
      var tab = sheet.getSheetByName('readers');
      if (!tab) { tab = sheet.insertSheet('readers'); tab.appendRow(['timestamp','name','email','phone','waitlist_opt_in','source']); }
      tab.appendRow([timestamp, data.name || '', data.email || '', data.phone || '', data.waitlist_opt_in || false, data.source || 'download']);
    }

    if (type === 'waitlist') {
      var tab = sheet.getSheetByName('waitlist');
      if (!tab) { tab = sheet.insertSheet('waitlist'); tab.appendRow(['timestamp','email','source']); }
      tab.appendRow([timestamp, data.email || '', data.source || 'waitlist']);
    }

    if (type === 'feedback') {
      var tab = sheet.getSheetByName('feedback');
      if (!tab) { tab = sheet.insertSheet('feedback'); tab.appendRow(['timestamp','name','email','phone','rating','feedback_text','recommend','source']); }
      tab.appendRow([timestamp, data.name || '', data.email || '', data.phone || '', data.rating || '', data.feedback_text || '', data.recommend, data.source || 'feedback_page']);
    }

    if (type === 'download_log') {
      var tab = sheet.getSheetByName('download_log');
      if (!tab) { tab = sheet.insertSheet('download_log'); tab.appendRow(['timestamp','method','source']); }
      tab.appendRow([timestamp, data.method || 'unknown', data.source || 'download_page']);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Digital Privacy is a Myth* API is running.' })).setMimeType(ContentService.MimeType.JSON);
}
