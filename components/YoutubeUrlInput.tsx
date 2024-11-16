'use client'

import { useState } from "react"

export function YoutubeUrlInput() {
    const [url, setUrl] = useState('');
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
                body: JSON.stringify({url})
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

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste YouTube URL here"
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Identify Music'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {result && (
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Identified Songs</h2>
                    {result.songs.map((song: any, index: number) => (
                        <div key={index} className="border-b py-2 last:border-0">
                            <p className="font-medium">{song.title}</p>
                            <p className="text-gray-600">{song.artist}</p>
                            <p className="text-sm text-gray-500">Timestamp: {song.timestamp}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}