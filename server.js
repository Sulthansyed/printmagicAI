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

// Securely initialized on server side
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- iPay88 Signature Generation (Malaysia) ---
app.post('/api/ipay88-signature', (req, res) => {
    try {
        const { orderId, amount, currency = 'MYR' } = req.body;

        // Fallback to test credentials if not configured in .env.local yet
        const merchantCode = process.env.IPAY88_MERCHANT_CODE || 'MOCK_MERCHANT_CODE';
        const merchantKey = process.env.IPAY88_MERCHANT_KEY || 'MOCK_KEY';

        if (!merchantCode || !merchantKey) {
            return res.status(500).json({ error: 'iPay88 Merchant credentials missing on backend.' });
        }

        // iPay88 requires the amount to be a string formatted with exactly 2 decimal places, but then removes the dot for the hash.
        // Example: "15.00" -> "1500"
        const amountStr = parseFloat(amount).toFixed(2);
        const amountForHash = amountStr.replace('.', '');

        // Hash format required by iPay88: MerchantKey + MerchantCode + RefNo + Amount + Currency
        const sourceString = merchantKey + merchantCode + orderId + amountForHash + currency;

        const signature = crypto.createHash('sha256').update(sourceString).digest('base64');

        res.json({
            merchantCode,
            signature,
            amountStr
        });
    } catch (error) {
        console.error('Signature Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate payment signature.' });
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

// --- Mock iPay88 Callback Endpoints ---
// These stand in for the real iPay88 response/backend URLs.
// Replace with real logic once iPay88 credentials are configured.

// Called by iPay88 to redirect the user's browser after payment
app.post('/api/ipay88-response', (req, res) => {
    const { Status, RefNo, Amount, Currency } = req.body;
    console.log('[iPay88 Mock Response]', { Status, RefNo, Amount, Currency });
    // In production: verify signature, then redirect to success or failure page
    res.redirect(Status === '1' ? '/?payment=success' : '/?payment=failed');
});

// Called by iPay88 server-to-server to confirm payment (backend notification)
app.post('/api/ipay88-backend', (req, res) => {
    const { Status, RefNo, Amount, Currency, Signature } = req.body;
    console.log('[iPay88 Mock Backend]', { Status, RefNo, Amount, Currency, Signature });
    // In production: verify signature, update order status in DB, then respond 'RECEIVEOK'
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
