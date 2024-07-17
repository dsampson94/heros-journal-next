import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import VoiceNote from '../../../../lib/models/VoiceNote';

export const config = {
    api: {
        bodyParser: false, // Disable body parsing, so we can handle it as raw form data
    },
};

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const formData = await req.formData();
    const audioFile = formData.get('audio');
    const temporaryUserId = formData.get('temporaryUserId') as string;

    if (!temporaryUserId) {
        return NextResponse.json({ error: 'Temporary user ID missing' }, { status: 400 });
    }

    if (!(audioFile instanceof File)) {
        return NextResponse.json({ error: 'Audio file missing' }, { status: 400 });
    }

    // Simulating AI transcription for demonstration purposes
    const transcription = 'This is a simulated transcription.';

    try {
        const audioURL = `data:audio/wav;base64,${await audioFile.arrayBuffer().then(buffer => Buffer.from(buffer).toString('base64'))}`;
        const voiceNote = new VoiceNote({
            audioURL: audioURL,
            transcription: transcription,
            temporaryUserId: temporaryUserId,
        });

        await voiceNote.save();

        return NextResponse.json({ audioURL: audioURL, transcription: transcription });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
