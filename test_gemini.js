import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local' });

async function test() {
    console.log("Key from env:", process.env.GEMINI_API_KEY);
    console.log("Key length:", process.env.GEMINI_API_KEY?.length);

    try {
        const ai1 = new GoogleGenAI();
        console.log("Testing with implicit initialization:");
        const response1 = await ai1.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hello'
        });
        console.log("Success implicit:", response1.text);
    } catch (e) {
        console.error("Implicit init failed:", e.message);
    }
}

test();
