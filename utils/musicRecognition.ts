import { PythonShell } from "python-shell";

export interface RecognizedSong {
    title: string;
    artist: string;
    timestamp: string;
}

export type SearchResults = {
    songs: RecognizedSong[];
}

export async function recognizeMusic(videoId: string): Promise<RecognizedSong[]> {

    try {

        const options = {
            mode: 'text' as const,
            pythonPath: 'python3',
            pythonOptions: ['-u'],
            args: [videoId]
        };

        const results = await new Promise((resolve, reject) => {
            PythonShell.run('scripts/shazam_recognize.py', options)
                .then(messages => {
                    //Find the last valid JSON message
                    let result = null;
                    for(let i = messages.length - 1; i >= 0; i--) {
                        try {
                            result = JSON.parse(messages[i]);
                            if(result && (result.matches || result.error)){
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    if(!result) {
                        console.error('No valid JSON found in messages', messages);
                        reject(new Error('No valid JSON found in recognition results'));
                        return;
                    }

                    if(result.error){
                        reject(new Error(result.error));
                        return;
                    }

                    if(!result.matches) {
                        reject(new Error('No matches found in recognition results'));
                        return;
                    }

                    resolve(result);
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

    return results.matches.map((match: any) => ({
        title: match.title,
        artist: match.artist,
        timestamp: formatTimestamp(match.offset)
    }))
}

function formatTimestamp(milliseconds: number): string {
    const seconds = Math.floor(milliseconds/1000);
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2,'0')}`;
}