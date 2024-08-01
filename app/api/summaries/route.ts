import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth';

const MONGODB_URI = process.env.MONGODB_URI!;
const EMAIL_HOST = process.env.EMAIL_HOST!;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT!);
const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

export async function POST(req: NextRequest) {
    const session = await getServerSession({ req });

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db('yourDatabaseName');
        const users = await db.collection('users').find({}).toArray();

        for (const user of users) {
            const voiceNotes = await db.collection('voiceNotes').find({ userId: user._id }).toArray();
            const summary = generateSummary(voiceNotes); // Implement this function to summarize the notes

            await sendEmail(user.email, summary);
        }

        return NextResponse.json({ message: 'Summaries sent' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error sending summaries', error: error.message }, { status: 500 });
    } finally {
        await client.close();
    }
}

const sendEmail = async (to: string, summary: string) => {
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Your VoiceNote Summary',
        text: summary,
    };

    await transporter.sendMail(mailOptions);
};
