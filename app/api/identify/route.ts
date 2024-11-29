import { NextResponse } from "next/server";
import { validateYoutubeUrl } from "@/utils/validateYoutubeUrl";
import { prisma } from "@/lib/prisma";
import { recognizeMusic, SearchResults } from "@/utils/musicRecognition";
import { Prisma } from "@prisma/client";

export async function POST(req: Request){
    try {
        const {url} = await req.json();

        if(!url){
            return NextResponse.json(
                {error: 'URL is required'},
                {status: 400}
            );
        }

        const videoId = validateYoutubeUrl(url);

        if(!videoId){
            return NextResponse.json(
                {error: 'Invalid YouTube URL'},
                {status: 400}
            );
        }

        //Here we would have to implement music regonition API Integration
        const results = await recognizeMusic(videoId);

        const resultsJson: Prisma.JsonValue = {
            songs: results.map(song => ({
                title: song.title,
                artist: song.artist,
                timestamp: song.timestamp
            }))
        };

        const search = await prisma.search.create({
            data: {
                youtubeUrl: url,
                results: resultsJson
            }
        })

        return NextResponse.json({ success: true, data: { songs: results} });
    } catch(error){
        console.error('Error processing request:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}