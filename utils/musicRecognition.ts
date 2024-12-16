import { PythonShell } from "python-shell";

export interface RecognizedSong {
    title: string;
    artist: string;
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
                        if(!result || (!result.matches && !result.error)){
                            console.error('Invalid JSON structure: ', result);
                            reject(new Error('Invalid JSON structure in recognition results'));
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

    return results.matches.map((match: any) => ({
        title: match.title,
        artist: match.artist
    }))
}

function formatTimestamp(milliseconds: number): string {
    const seconds = Math.floor(milliseconds/1000);
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2,'0')}`;
}