'use client'

import { useState } from "react"

interface TimeRange {
    start?: number;
    end?: number;
}

export function YoutubeUrlInput() {
    const [url, setUrl] = useState('');
    const [timeRange, setTimeRange] = useState<TimeRange>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/identify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    timeRange: {
                        start: timeRange.start,
                        end: timeRange.end
                    }
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to identify music');
            }

            setResult(data.data);
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const handleTimeChange = (field: 'start' | 'end', value: string) => {
        // Convert MM:SS format to seconds
        if (value) {
            const [minutes, seconds] = value.split(':').map(Number);
            const totalSeconds = minutes * 60 + (seconds || 0);
            setTimeRange(prev => ({ ...prev, [field]: totalSeconds }));
        } else {
            setTimeRange(prev => {
                const newRange = { ...prev };
                delete newRange[field];
                return newRange;
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube URL here"
                            className="flex-1 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-gray-50"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Start Time (MM:SS):</label>
                            <input
                                type="text"
                                pattern="^[0-9]{1,2}:[0-9]{2}$"
                                placeholder="00:00"
                                className="p-2 border border-gray-200 rounded-lg w-24"
                                onChange={(e) => handleTimeChange('start', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">End Time (MM:SS):</label>
                            <input
                                type="text"
                                pattern="^[0-9]{1,2}:[0-9]{2}$"
                                placeholder="00:00"
                                className="p-2 border border-gray-200 rounded-lg w-24"
                                onChange={(e) => handleTimeChange('end', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Identify Music'}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="p-5 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}

            {result && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-900">Identified Songs</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {result.songs.map((song: any, index: number) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-gray-900">{song.title}</h3>
                                    <p className="text-gray-600">{song.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}