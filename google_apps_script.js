// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this code into the editor (replace everything)
// 4. Click "Deploy" > "New deployment"
// 5. Select type: "Web app"
// 6. Description: "Waitlist API"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone" (IMPORTANT!)
// 9. Click "Deploy"
// 10. Copy the "Web App URL" and paste it into main.js

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // If it's a new sheet, add headers
    if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Email", "Source"]);
    }

    var params = e.parameter;
    var email = params.email;
    var source = params.source || "website";

    if (email) {
        sheet.appendRow([new Date(), email, source]);
        return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);
    } else {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": "No email provided" }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
