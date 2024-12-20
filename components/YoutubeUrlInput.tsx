'use client'

import { useState } from "react"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

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
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>YouTube Music Finder</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="url">YouTube URL</Label>
                        <Input
                            id="url"
                            type="url"
                            placeholder="Paste YouTube URL here"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="start">Start Time (MM:SS)</Label>
                            <Input
                                id="start"
                                type="text"
                                pattern="^[0-9]{1,2}:[0-9]{2}$"
                                placeholder="00:00"
                                onChange={(e) => handleTimeChange('start', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="end">End Time (MM:SS)</Label>
                            <Input
                                id="end"
                                type="text"
                                pattern="^[0-9]{1,2}:[0-9]{2}$"
                                placeholder="00:00"
                                onChange={(e) => handleTimeChange('end', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : 'Find Music'}
                    </Button>
                </form>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {result && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Music in this video:</h2>
                        <ul className="space-y-2">
                            {result.songs.map((song: any, index: number) => (
                                <li key={index} className="bg-gray-100 p-2 rounded">
                                    <span className="font-medium">{song.title}</span> by {song.artist}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}