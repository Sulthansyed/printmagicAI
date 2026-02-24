import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

console.log('Loaded API Key:', process.env.GEMINI_API_KEY ? 'Yes (Starts with ' + process.env.GEMINI_API_KEY.substring(0, 5) + ')' : 'No');

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true })); // iPay88 POSTs as form-encoded

// Securely initialized on server side
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- iPay88 Helper: Generate SHA256 Signature ---
function generateIPay88Signature(merchantKey, merchantCode, refNo, amount, currency) {
    // iPay88 format: SHA256(MerchantKey + MerchantCode + RefNo + Amount_no_dots + Currency)
    const amountForHash = parseFloat(amount).toFixed(2).replace('.', '');
    const source = merchantKey + merchantCode + refNo + amountForHash + currency;
    return crypto.createHash('sha256').update(source).digest('base64');
}

// --- iPay88: Initiate Payment ---
// Returns the full form payload for the frontend to auto-submit to iPay88
app.post('/api/ipay88-initiate', (req, res) => {
    try {
        const { orderId, amount, currency = 'MYR', prodDesc, userName, userEmail, userContact, remark = '' } = req.body;

        const merchantCode = process.env.IPAY88_MERCHANT_CODE;
        const merchantKey = process.env.IPAY88_MERCHANT_KEY;

        if (!merchantCode || !merchantKey) {
            return res.status(500).json({ error: 'iPay88 credentials not configured.' });
        }

        // Shorten RefNo to stay within iPay88's 20-char limit
        const refNo = orderId.length > 20 ? orderId.substring(0, 20) : orderId;

        const amountStr = parseFloat(amount).toFixed(2);
        const signature = generateIPay88Signature(merchantKey, merchantCode, refNo, amountStr, currency);

        // Railway terminates SSL at the proxy, so req.protocol returns 'http'.
        // We must use https explicitly for the callback URLs.
        const host = req.get('host');
        const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
        const baseUrl = process.env.BASE_URL || (isLocalhost ? `http://${host}` : `https://${host}`);

        const payload = {
            MerchantCode: merchantCode,
            PaymentId: '0',     // 0 = show all payment methods
            RefNo: refNo,
            Amount: amountStr,
            Currency: currency,
            ProdDesc: prodDesc || 'PrintMagic AI Merchandise',
            UserName: userName || '',
            UserEmail: userEmail || '',
            UserContact: userContact || '',
            Remark: remark,
            Lang: 'UTF-8',
            SignatureType: 'SHA256',
            Signature: signature,
            ResponseURL: `${baseUrl}/api/ipay88-response`,
            BackendURL: `${baseUrl}/api/ipay88-backend`,
        };

        console.log('[iPay88 Initiate] Full payload:', JSON.stringify(payload, null, 2));
        res.json({ payload, paymentUrl: 'https://payment.ipay88.com.my/epayment/payment.asp' });
    } catch (error) {
        console.error('iPay88 Initiation Error:', error);
        res.status(500).json({ error: 'Failed to initiate payment.' });
    }
});

// 1. New Endpoint: AI Prompt Optimizer (The "Prompt Engineer")
app.post('/api/optimize-prompt', async (req, res) => {
    try {
        const { rawPrompt } = req.body;

        if (!rawPrompt) {
            return res.status(400).json({ error: 'Missing raw prompt' });
        }

        const systemInstruction = `
      You are an expert AI Prompt Engineer for an image generation service. 
      Your job is to take the user's simple, short idea and expand it into a highly detailed, professional prompt strictly following this 5-part structure:
      
      Medium: [Specify the art medium, e.g., 3D CGI, Oil Painting, Anime Cell, Action Poster]
      Subject: The person from the uploaded photo, completely redrawn as [describe what they become].
      Setting: [Describe the background environment in vivid detail]
      Lighting: [Describe the atmosphere and lighting style]
      Override: The entire person and environment must be consistently rendered in this [insert medium] style; do not paste a real photo face.
      
      User Idea: "${rawPrompt}"
      
      Respond ONLY with the final expanded prompt. Do not add any conversational text.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ text: systemInstruction }], // Changed to array of parts
        });

        const optimizedPrompt = response.text;
        res.json({ optimizedPrompt });

    } catch (error) {
        console.error('Prompt Optimization Error:', error);
        res.status(500).json({ error: 'Failed to optimize prompt.' });
    }
});

// 2. Existing Generation Endpoint
app.post('/api/generate', async (req, res) => {
    try {
        const { photo, prompt } = req.body;

        if (!photo || !prompt) {
            return res.status(400).json({ error: 'Missing photo or prompt' });
        }

        const base64Data = photo.split(',')[1];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                    {
                        text: `
              Use the uploaded photo as the primary reference subject.
              Transform the entire image, INCLUDING THE SUBJECT'S FACE AND BODY, into the requested art style.
              
              CRITICAL INSTRUCTION: Do NOT just paste a photorealistic face onto a stylized body. The face MUST be completely redrawn in the target style (e.g. if the style is "Cartoon", the face must be a cartoon; if "Comic", the face must be drawn like a comic book character).
              
              While redrawing in the new style, preserve the subject's fundamental likeness and identity by maintaining:
              - Accurate facial proportions
              - Distinctive physical features (hair shape, jawline, glasses, etc.)
              - The general expression from the original photo

              STYLE DESCRIPTION: ${prompt}

              Output: high-quality, cohesive, print-ready image with centered composition.
            `
                    }
                ]
            }
        });

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("No candidates returned. The image may have been blocked by safety filters.");
        }

        const candidate = response.candidates[0];
        if (!candidate.content?.parts) {
            throw new Error("Response candidate has no content parts.");
        }

        let imageUrl = null;
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }

        if (imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(500).json({ error: "No image generated." });
        }
    } catch (error) {
        console.error('Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate AI art.' });
    }
});

// --- iPay88 Callback: Browser Redirect (Response URL) ---
// iPay88 POSTs here after user completes payment, then we redirect the browser
app.post('/api/ipay88-response', (req, res) => {
    const { Status, RefNo, Amount, Currency, Signature, ErrDesc } = req.body;
    console.log('[iPay88 Response]', { Status, RefNo, Amount, Currency, ErrDesc });

    // Verify signature
    const merchantCode = process.env.IPAY88_MERCHANT_CODE;
    const merchantKey = process.env.IPAY88_MERCHANT_KEY;
    if (merchantCode && merchantKey) {
        const expectedSig = generateIPay88Signature(merchantKey, merchantCode, RefNo, Amount, Currency);
        if (Signature !== expectedSig) {
            console.error('[iPay88 Response] Signature mismatch!', { expected: expectedSig, received: Signature });
        }
    }

    // Status '1' = success, anything else = failed
    if (Status === '1') {
        res.redirect('/?payment=success&refno=' + encodeURIComponent(RefNo));
    } else {
        res.redirect('/?payment=failed&err=' + encodeURIComponent(ErrDesc || 'Payment was not completed'));
    }
});

// --- iPay88 Callback: Server-to-Server (Backend URL) ---
// iPay88 calls this independently to confirm payment — must respond 'RECEIVEOK'
app.post('/api/ipay88-backend', (req, res) => {
    const { Status, RefNo, Amount, Currency, Signature, TransId, ErrDesc } = req.body;
    console.log('[iPay88 Backend]', { Status, RefNo, Amount, Currency, TransId, ErrDesc });

    // Verify signature
    const merchantCode = process.env.IPAY88_MERCHANT_CODE;
    const merchantKey = process.env.IPAY88_MERCHANT_KEY;
    if (merchantCode && merchantKey) {
        const expectedSig = generateIPay88Signature(merchantKey, merchantCode, RefNo, Amount, Currency);
        if (Signature !== expectedSig) {
            console.error('[iPay88 Backend] Signature mismatch!');
            return res.status(400).send('INVALID SIGNATURE');
        }
    }

    if (Status === '1') {
        console.log(`[iPay88 Backend] Payment CONFIRMED for ${RefNo}, TransId: ${TransId}`);
        // TODO: Update order status in database when DB is added
    } else {
        console.log(`[iPay88 Backend] Payment FAILED for ${RefNo}: ${ErrDesc}`);
    }

    // iPay88 requires this exact response
    res.send('RECEIVEOK');
});

// --- Serve Vite-built frontend in production ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

// SPA catch-all: serve index.html for any non-API route
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`[Server] Listening on http://localhost:${port}`);
});
