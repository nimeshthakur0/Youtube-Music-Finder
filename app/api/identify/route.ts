import { NextResponse } from "next/server";
import { validateYoutubeUrl } from "@/utils/validateYoutubeUrl";
import { PrismaClient } from "@prisma/client/extension";
import { timeStamp } from "console";

const prisma = new PrismaClient();

export async function POST(req: Request){
    try {
        const {url} = await req.json();
        const videoId = validateYoutubeUrl(url);

        if(!videoId){
            return NextResponse.json(
                {error: 'Invalid YouTube URL'},
                {status: 400}
            );
        }

        //Here we would have to implement music regonition API Integration
        const mockResult = {
            songs: [
                {
                title: "Sample Song",
                artist: "Sample Artist",
                timeStamp: "1:23"
                }
            ]
        }

        const search = await prisma.search.create({
            data: {
                youtubeUrl: url,
                results: mockResult
            }
        });

        return NextResponse.json({ success: true, data: mockResult});
    } catch(error){
        console.error('Error processing request:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}