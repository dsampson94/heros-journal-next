import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/server';
import connectToDatabase from '../../../lib/mongoose';
import VoiceNote from '../../../lib/models/VoiceNote';
import { sendEmail } from '../../../lib/nodemailer';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);

    try {
        const voiceNotes = await VoiceNote.find({ userId });

        // Collect all transcriptions
        const transcriptions = voiceNotes.map(note => note.transcription).join('\n');

        // Prepare data for OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an analysis assistant.'
                    },
                    {
                        role: 'user',
                        content: `Analyze the following transcriptions and provide an overall summary and key insights:\n\n${transcriptions}`
                    }
                ],
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const analysis = response.data.choices[0].message.content.trim();

        await sendEmail('user@example.com', 'Your VoiceNote Summary', analysis);

        return NextResponse.json({ analysis });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
