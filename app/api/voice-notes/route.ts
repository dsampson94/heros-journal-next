import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/server';
import connectToDatabase from '../../../lib/mongoose';
import VoiceNote from '../../../lib/models/VoiceNote';
import User from '../../../lib/models/User';
import axios from 'axios';
import FormData from 'form-data';
import { Buffer } from 'buffer';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);

    try {
        const voiceNotes = await VoiceNote.find({ userId });
        return NextResponse.json(voiceNotes);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const formData = await req.formData();
    const audio = formData.get('audio');
    const temporaryUserId = formData.get('temporaryUserId');

    if (!audio) {
        return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    try {
        // Convert Blob to Buffer
        const audioBlob = audio as Blob;
        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Prepare form-data for Whisper API
        const form = new FormData();
        form.append('file', buffer, { filename: 'audio.wav' });
        form.append('model', 'whisper-1');

        // Call the Whisper API for transcription
        const whisperResponse = await axios.post(
            'https://api.openai.com/v1/audio/transcriptions',
            form,
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    ...form.getHeaders()
                }
            }
        );

        const transcription = whisperResponse.data.text;

        // Convert audio buffer to base64 and create audio URL
        const audioBase64 = buffer.toString('base64');
        const audioURL = `data:audio/wav;base64,${audioBase64}`;

        // Save voice note to the database
        const voiceNote = new VoiceNote({
            audioURL, // Storing the audio as base64 URL
            transcription,
            temporaryUserId: temporaryUserId ? temporaryUserId.toString() : undefined,
            userId: temporaryUserId ? undefined : verifyToken(req).id,
        });

        await voiceNote.save();

        // If userId is present, update the user's voice notes list
        if (voiceNote.userId) {
            await User.findByIdAndUpdate(voiceNote.userId, { $push: { voiceNotes: voiceNote._id } });
        }

        return NextResponse.json(voiceNote);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
