'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../../lib/auth';
import Analysis from '../../components/Analysis';

const Dashboard: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [voiceNotes, setVoiceNotes] = useState<any[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setUserId(userId);
        fetchVoiceNotes();
    }, []);

    const fetchVoiceNotes = async () => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`/api/voice-notes`, { headers });
            setVoiceNotes(response.data);
        } catch (error) {
            console.error('Error fetching voice notes:', error);
        }
    };

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
                formData.append('userId', userId as string);

                try {
                    const headers = getAuthHeaders();
                    const response = await axios.post('/api/voice-notes', formData, { headers });
                    setTranscription(response.data.transcription);
                    setVoiceNotes([...voiceNotes, {
                        _id: response.data._id,
                        audioURL: response.data.audioURL,
                        transcription: response.data.transcription
                    }]);
                } catch (error) {
                    console.error('Error saving voice note:', error);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    const handleDeleteVoiceNote = async (voiceNoteId: string) => {
        try {
            const headers = getAuthHeaders();
            await axios.delete(`/api/voice-notes/${voiceNoteId}`, { headers });
            setVoiceNotes(voiceNotes.filter(note => note._id !== voiceNoteId));
        } catch (error) {
            console.error('Error deleting voice note:', error);
        }
    };

    return (
        <div className="dashboard min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Your Voice Notes</h1>
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
            <Analysis />
            <div className="voice-notes mt-8">
                <h2 className="text-xl font-bold mb-2">Previous Voice Notes</h2>
                {voiceNotes.length === 0 ? (
                    <p className="text-gray-600">No voice notes found.</p>
                ) : (
                    <ul className="space-y-4">
                        {voiceNotes.map((note) => (
                            <li key={note._id} className="p-4 bg-white rounded shadow flex items-center justify-between">
                                <div className="flex-grow">
                                    <audio src={note.audioURL} controls className="w-full mb-2" />
                                    <p className="text-gray-700">{note.transcription}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteVoiceNote(note._id)}
                                    className="btn btn-danger px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition ml-4"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
