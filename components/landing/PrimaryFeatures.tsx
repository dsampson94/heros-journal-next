import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PrimaryFeatures: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [voiceNotes, setVoiceNotes] = useState<any[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const router = useRouter();

    const [temporaryUserId, setTemporaryUserId] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('temporaryUserId') || uuidv4();
        if (!localStorage.getItem('temporaryUserId')) {
            localStorage.setItem('temporaryUserId', userId);
        }
        setTemporaryUserId(userId);
    }, []);

    const handleStartStopRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlob);
                setAudioURL(audioURL);

                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.wav');
                formData.append('temporaryUserId', temporaryUserId as string);

                try {
                    const response = await axios.post('/api/voice-notes/temporary', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    const data = response.data;
                    setTranscription(data.transcription);
                    setVoiceNotes([...voiceNotes, { audioURL: data.audioURL, transcription: data.transcription }]);
                } catch (error) {
                    console.error('Error uploading voice note:', error);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    const handleSignup = () => {
        router.push('/register');
    };

    return (
        <div className="primary-features p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Record Your Voice Notes</h2>
            <button
                onClick={handleStartStopRecording}
                className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioURL && (
                <div className="mt-4">
                    <audio src={audioURL} controls className="w-full mb-2" />
                    <p className="text-gray-700">{transcription}</p>
                </div>
            )}
            <button onClick={handleSignup} className="mt-4 btn btn-secondary px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Sign Up
            </button>
        </div>
    );
};

export default PrimaryFeatures;
