// ====================================================
// PrintMagic AI — Google Apps Script for Order Logging
// ====================================================
// 
// SETUP INSTRUCTIONS:
// 
// 1. Go to Google Sheets → Create a new spreadsheet
//    Name it: "PrintMagic Orders"
//
// 2. In Row 1, add these column headers (A1 through L1):
//    Date | RefNo | TransId | Amount | Currency | Status | CustomerName | Email | Phone | Product | ShippingAddress | PaymentMethod
//
// 3. Go to Extensions → Apps Script
//
// 4. Delete any existing code, paste THIS entire file
//
// 5. Click Deploy → New Deployment (create a NEW one, don't edit the old one)
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
//    - Click Deploy
//
// 6. Copy the NEW Web App URL (starts with: https://script.google.com/macros/s/XXXXX/exec)
//
// 7. Update GOOGLE_SHEET_WEBHOOK in Railway environment variables with the NEW URL
//
// 8. Done! Orders will now auto-log to your sheet.
// ====================================================

// Uses GET request with data as URL parameter (more reliable from server environments)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var jsonString = e.parameter.data;
    var data = JSON.parse(jsonString);
    
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.refNo || '',
      data.transId || '',
      data.amount || '',
      data.currency || '',
      data.status || '',
      data.customerName || '',
      data.email || '',
      data.phone || '',
      data.product || '',
      data.shippingAddress || '',
      data.paymentMethod || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Also keep doPost as a fallback
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.refNo || '',
      data.transId || '',
      data.amount || '',
      data.currency || '',
      data.status || '',
      data.customerName || '',
      data.email || '',
      data.phone || '',
      data.product || '',
      data.shippingAddress || '',
      data.paymentMethod || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this in Apps Script to verify the sheet is accessible
function testAppend() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow([
    new Date().toISOString(),
    'TEST-001',
    'T000000000',
    '1.00',
    'MYR',
    'SUCCESS',
    'Test User',
    'test@example.com',
    '60123456789',
    'Test Product',
    'Test Address',
    'FPX'
  ]);
  Logger.log('Test row added!');
}
