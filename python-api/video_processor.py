import asyncio
import os
import json
from typing import List, Dict
import yt_dlp
from groq import Groq
import aiofiles
from concurrent.futures import ThreadPoolExecutor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VideoProcessor:
    def __init__(self, output_dir="downloaded_videos"):
        self.output_dir = output_dir
        self.groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/transcripts", exist_ok=True)

    async def process_videos(self, video_details: List[Dict]) -> List[Dict]:
        tasks = []
        for video in video_details:
            tasks.append(self.process_single_video(video))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [r for r in results if r is not None]

    async def process_single_video(self, video: Dict) -> Dict:
        try:
            video_id = video['id']
            video_url = video['link']
            
            # Download video
            audio_path = await self.download_video_audio(video_url, video_id)
            if not audio_path:
                return None

            # Extract text
            transcript = await self.extract_text(audio_path)
            
            # Save transcript
            await self.save_transcript(video_id, transcript)
            
            # Add transcript to video details
            video['transcript'] = transcript
            return video

        except Exception as e:
            logger.error(f"Error processing video {video['id']}: {str(e)}")
            return None

    async def download_video_audio(self, url: str, video_id: str) -> str:
        output_path = f"{self.output_dir}/{video_id}.m4a"
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': output_path,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
            }],
        }

        def _download():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            return output_path

        # Run download in threadpool
        with ThreadPoolExecutor() as pool:
            return await asyncio.get_event_loop().run_in_executor(pool, _download)

    async def extract_text(self, audio_path: str) -> str:
        with open(audio_path, "rb") as file:
            translation = self.groq_client.audio.translations.create(
                file=(audio_path, file.read()),
                model="whisper-large-v3",
                response_format="json",
                temperature=0.0
            )
            return translation.text

    async def save_transcript(self, video_id: str, transcript: str):
        transcript_path = f"{self.output_dir}/transcripts/{video_id}.txt"
        async with aiofiles.open(transcript_path, 'w', encoding='utf-8') as f:
            await f.write(transcript)
