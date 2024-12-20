import { PythonShell } from "python-shell";

export interface RecognizedSong {
    title: string;
    artist: string;
}

export type SearchResults = {
    songs: RecognizedSong[];
}

interface TimeRange {
    start?: number; // in seconds
    end?: number;   // in seconds
}

export async function recognizeMusic(videoId: string, timeRange?: TimeRange): Promise<RecognizedSong[]> {

    try {
        console.log('Recognizing music with time range:', timeRange); // Add this log

        const options = {
            mode: 'text' as const,
            pythonPath: 'python3',
            pythonOptions: ['-u'],
            args: [
                videoId,
                ...(timeRange?.start !== undefined ? [timeRange.start.toString()] : []),
                ...(timeRange?.end !== undefined ? [timeRange.end.toString()] : [])
            ]
        };

        console.log('Sending args to Python:', options.args);

        const results = await new Promise((resolve, reject) => {
            PythonShell.run('scripts/shazam_recognize.py', options)
                .then(messages => {
                    console.log('Raw messages from Python:', messages)
                    //Find the last valid JSON message
                    const lastMessage = messages[messages.length - 1];
                    const jsonMatch = lastMessage.match(/\{.*\}/);

                    if(!jsonMatch) {
                        console.error('No JSON message found in:', messages);
                        reject(new Error('No JSON message found in recognition results'));
                        return;
                    }

                    try {
                        const result = JSON.parse(jsonMatch[0]);
                        if (result.error) {
                            reject(new Error(result.error));
                            return;
                        }
                        resolve(result);
                    } catch (e) {
                        console.error('Failed to parse JSON:', jsonMatch);
                        reject(new Error('Failed to parse JSON from recognition results'));
                    }
                })    
                .catch(reject);
        });

        return processShazamResults(results);
    } catch(error) {
        console.error('Error in music recognition', error);
        throw error;
    }
}

function processShazamResults(results: any): RecognizedSong[] {

    const uniqueSongs = new Set<string>();

    if(!results || !results.matches || !Array.isArray(results.matches)){
        return [];
    }

    return results.matches
        .filter((match: any) => {
            const songKey = `${match.title}|${match.artist}`;
            if(uniqueSongs.has(songKey)) {
                return false;
            }
            uniqueSongs.add(songKey);
            return true;
        })
        .map((match: any) => ({
            title: match.title,
            artist: match.artist
        }));
}

function formatTimestamp(milliseconds: number): string {
    const seconds = Math.floor(milliseconds/1000);
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2,'0')}`;
}