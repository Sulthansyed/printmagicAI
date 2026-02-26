/**
 * iPay88 Standalone Test — Generates a test HTML form and opens it
 * Run: node test_ipay88.js
 * 
 * This creates a simple HTML file that auto-submits to iPay88.
 * Used to isolate whether the error is from our signature or from account config.
 */

import crypto from 'crypto';
import fs from 'fs';

// iPay88 Demo Credentials
const MERCHANT_KEY = 'ascTrU9hLs';
const MERCHANT_CODE = 'M45082';
const REF_NO = 'TEST' + Date.now();
const AMOUNT = '1.00';
const AMOUNT_NO_DECIMAL = '100';
const CURRENCY = 'MYR';

// Generate HMAC-SHA512 signature (per iPay88 Technical API v1.6.4.4)
const source = MERCHANT_KEY + MERCHANT_CODE + REF_NO + AMOUNT_NO_DECIMAL + CURRENCY;
const signature = crypto.createHmac('sha512', MERCHANT_KEY).update(source).digest('hex');

console.log('=== iPay88 Signature Test ===');
console.log('Source string:', source);
console.log('HMAC-SHA512 (hex):', signature);
console.log('Signature length:', signature.length, '(should be 128)');
console.log('');

// Also try SHA256 (in case older demo accounts still use it)
const sha256Source = MERCHANT_KEY + MERCHANT_CODE + REF_NO + AMOUNT_NO_DECIMAL + CURRENCY;
const sha256Sig = crypto.createHash('sha256').update(sha256Source).digest('hex');
console.log('SHA256 (hex) for comparison:', sha256Sig);
const sha256SigBase64 = crypto.createHash('sha256').update(sha256Source).digest('base64');
console.log('SHA256 (base64) for comparison:', sha256SigBase64);

// Generate test HTML form — HMAC-SHA512 version
const html = `<!DOCTYPE html>
<html>
<head><title>iPay88 Test</title></head>
<body>
<h2>iPay88 Payment Test</h2>
<p>RefNo: ${REF_NO}</p>
<p>Amount: ${AMOUNT}</p>
<p>Signature: ${signature}</p>
<p>This form will auto-submit in 3 seconds...</p>

<form id="ipay88form" method="POST" action="https://payment.ipay88.com.my/epayment/payment.asp">
  <input type="hidden" name="MerchantCode" value="${MERCHANT_CODE}" />
  <input type="hidden" name="PaymentId" value="" />
  <input type="hidden" name="RefNo" value="${REF_NO}" />
  <input type="hidden" name="Amount" value="${AMOUNT}" />
  <input type="hidden" name="Currency" value="${CURRENCY}" />
  <input type="hidden" name="ProdDesc" value="Test Product" />
  <input type="hidden" name="UserName" value="Test User" />
  <input type="hidden" name="UserEmail" value="sulthanibrahim90@gmail.com" />
  <input type="hidden" name="UserContact" value="60183731743" />
  <input type="hidden" name="Remark" value="" />
  <input type="hidden" name="Lang" value="UTF-8" />
  <input type="hidden" name="SignatureType" value="HMACSHA512" />
  <input type="hidden" name="Signature" value="${signature}" />
  <input type="hidden" name="ResponseURL" value="https://printmagicai.up.railway.app/api/ipay88-response" />
  <input type="hidden" name="BackendURL" value="https://printmagicai.up.railway.app/api/ipay88-backend" />
  <br/>
  <button type="submit" style="font-size: 20px; padding: 10px 30px; cursor: pointer;">Submit to iPay88</button>
</form>

<!-- Don't auto-submit, let user click to test manually -->
</body>
</html>`;

fs.writeFileSync('test_ipay88.html', html);
console.log('\n✅ Created test_ipay88.html — open it in your browser to test');
console.log('NOTE: This must be opened from the Railway URL to match the registered Request URL.');
console.log('Alternatively, test manually by clicking the Submit button.');
