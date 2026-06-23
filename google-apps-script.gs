/**
 * KD Coaching Institute — form collector
 * Receives waitlist + enquiry form submissions and appends them to this
 * spreadsheet (one tab per form type). Deploy as a Web App (see steps below).
 *
 * SETUP
 * 1. Create a Google Sheet (go to https://sheets.new). Name it e.g.
 *    "KD Coaching — Form Submissions".
 * 2. In that sheet: Extensions ▸ Apps Script.
 * 3. Delete any sample code, paste THIS whole file, and click Save (disk icon).
 * 4. Click Deploy ▸ New deployment ▸ gear icon ▸ "Web app".
 *      - Description: KD forms
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Click Deploy. Authorize when asked (if you see "Google hasn't verified
 *    this app", click Advanced ▸ "Go to <project> (unsafe)" — it's your own
 *    script, so it's safe).
 * 5. Copy the "Web app URL" (ends with /exec) and send it back.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var p = (e && e.parameter) ? e.parameter : {};
    var isEnquiry = (p.formType === "enquiry");
    var tabName = isEnquiry ? "Enquiries" : "Waitlist";
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    if (sheet.getLastRow() === 0) {
      if (isEnquiry) {
        sheet.appendRow(["Timestamp", "Name", "Phone", "Email", "Student", "Class", "Message", "Page"]);
      } else {
        sheet.appendRow(["Timestamp", "Parent / Guardian", "Student", "Grade (2027)", "Phone", "Email", "Message", "Page"]);
      }
      sheet.setFrozenRows(1);
    }

    if (isEnquiry) {
      sheet.appendRow([new Date(), p.parent || "", p.phone || "", p.email || "", p.student || "", p.grade || "", p.message || "", p.page || ""]);
    } else {
      sheet.appendRow([new Date(), p.parent || "", p.student || "", p.grade || "", p.phone || "", p.email || "", p.message || "", p.page || ""]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Lets you open the /exec URL in a browser to confirm it's live. */
function doGet() {
  return ContentService
    .createTextOutput("KD Coaching form collector is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
