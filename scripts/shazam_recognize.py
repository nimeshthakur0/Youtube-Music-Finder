import os
import yt_dlp
from shazamio import Shazam
import asyncio
import sys
import json
import logging
import tempfile
from yt_dlp.utils import download_range_func

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

async def download_and_recognize(video_id, start_time = None, end_time = None):
    try:
        logger.info(f"Processing video {video_id} with time range: start={start_time}s, end={end_time}s")  # Changed to info level

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
            'logger': None,
            'progress_hooks': [],
            'noprogess': True,
            'no_color': True,
            "consoletitle": False,
            'verbose': False
        }

        # Add time range if specified
        if start_time is not None or end_time is not None:
            time_range = [(float(start_time or 0), float(end_time or float('inf')))]
            logger.info(f"Downloading with time range: {time_range}")  # Add this log
            ydl_opts.update({
                'download_ranges': download_range_func(None, [(float(start_time or 0), float(end_time or float('inf')))]),
                'force_keyframes_at_cuts': True,
            })

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
                "artist": out.get("track", {}).get("subtitle", "Unknown")
            } for match in out.get("matches", [])]
        }    

        print(json.dumps(result))

    except Exception as e:
        logger.error(f"Error during recognition: {str(e)}")
        print(json.dumps({"error": str(e)}))    

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video ID provided"}))
    else:    
        video_id = sys.argv[1]
        start_time = sys.argv[2] if len(sys.argv) > 2 else None
        end_time = sys.argv[3] if len(sys.argv) > 3 else None
        asyncio.run(download_and_recognize(video_id, start_time, end_time))