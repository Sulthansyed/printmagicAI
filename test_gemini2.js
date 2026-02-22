import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local' });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking initialization with key:", key);

    try {
        const ai1 = new GoogleGenAI({ apiKey: key });
        console.log("Testing with explicit initialization...");
        const response1 = await ai1.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hello'
        });
        console.log("Success explicit:", response1.text);
    } catch (e) {
        console.error("Explicit init failed:", e.message);
    }
}

test();
