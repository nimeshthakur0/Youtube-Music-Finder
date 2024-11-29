import os
import yt_dlp
from shazamio import Shazam
import asyncio
import sys
import json
import logging
import tempfile

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

async def download_and_recognize(video_id):
    try:
        logger.debug(f"Starting download for video ID: {video_id}")

        #Configure yt-dlp options
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(tempfile.gettempdir(), f'{video_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'logger': None
        }

        #Download audio
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            url = f"https://www.youtube.com/watch?v={video_id}"
            ydl.download([url])

        #Path  to download audio
        audio_path = os.path.join(tempfile.gettempdir(), f'{video_id}.mp3')

        #Recognize song
        logger.debug(f"Starting recgnizing for file: {audio_path}")
        shazam = Shazam()
        out = await shazam.recognize_song(audio_path)
        logger.debug("Recogniton completed successfully")
        
        #Clean up temp file
        try:
            os.remove(audio_path)
        except Exception as e:
            logger.warning(f"Failed to remove temp file: {e}")

        result = {
            "matches": [{
                "title": out.get("track", {}).get("title", "Unknown"),
                "artist": out.get("track", {}).get("subtitle", "Unknown"),
                "offset": match.get("offset", 0)
            } for match in out.get("matches", [])]
        }    

        print(json.dumps(out))

    except Exception as e:
        logger.error(f"Error during recognition: {str(e)}")
        print(json.dumps({"error": str(e)}))    

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video ID provided"}))
    else:    
        video_id = sys.argv[1]
        asyncio.run(download_and_recognize(video_id))