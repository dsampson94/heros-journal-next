import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/server';
import connectToDatabase from '../../../lib/mongoose';
import VoiceNote from '../../../lib/models/VoiceNote';
import User from '../../../lib/models/User';

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
        const audioBlob = audio as Blob;
        const audioURL = URL.createObjectURL(audioBlob); // This is for testing, replace with actual storage logic
        const transcription = 'Dummy transcription'; // Replace with actual transcription logic

        const voiceNote = new VoiceNote({
            audioURL,
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
