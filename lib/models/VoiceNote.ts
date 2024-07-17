import mongoose, { Schema, Document, Model, model, models } from 'mongoose';

interface IVoiceNote extends Document {
    audioURL: string;
    transcription: string;
    temporaryUserId?: string;
    userId?: mongoose.Types.ObjectId;
}

const VoiceNoteSchema: Schema<IVoiceNote> = new Schema({
    audioURL: { type: String, required: true },
    transcription: { type: String, required: true },
    temporaryUserId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const VoiceNote: Model<IVoiceNote> = models.VoiceNote || model<IVoiceNote>('VoiceNote', VoiceNoteSchema);

export type { IVoiceNote };
export default VoiceNote;
