import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../lib/auth';

const Analysis: React.FC = () => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.get('/api/analysis', { headers });
                setAnalysis(response.data.analysis);
            } catch (error: any) {
                setError(error.response?.data?.error || 'Failed to fetch analysis');
            }
        };

        fetchAnalysis();
    }, []);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="analysis bg-white p-4 rounded shadow my-4">
            <h2 className="text-xl font-bold mb-2">Analysis</h2>
            {analysis ? (
                <p className="text-gray-700">{analysis}</p>
            ) : (
                <p className="text-gray-500">Loading analysis...</p>
            )}
        </div>
    );
};

export default Analysis;
