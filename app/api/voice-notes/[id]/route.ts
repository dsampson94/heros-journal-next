import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import VoiceNote from '../../../../lib/models/VoiceNote';
import { verifyToken } from '../../../../lib/server';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;

    try {
        const voiceNote = await VoiceNote.findOne({ _id: id, userId });
        if (!voiceNote) {
            return NextResponse.json({ error: 'Voice note not found' }, { status: 404 });
        }
        return NextResponse.json(voiceNote);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;
    const data = await req.json();

    try {
        const updatedVoiceNote = await VoiceNote.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true }
        );

        if (!updatedVoiceNote) {
            return NextResponse.json({ error: 'Voice note not found' }, { status: 404 });
        }

        return NextResponse.json(updatedVoiceNote);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;

    try {
        const deletedVoiceNote = await VoiceNote.findOneAndDelete({ _id: id, userId });
        if (!deletedVoiceNote) {
            return NextResponse.json({ error: 'Voice note not found' }, { status: 404 });
        }

        return NextResponse.json(deletedVoiceNote);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
