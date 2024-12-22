# YouTube Music Finder

A web application that helps users identify music playing in YouTube videos. Built with Next.js, TypeScript, and Python, this tool leverages the Shazam API to recognize songs from YouTube videos.

## Features

- 🎵 Identify songs from any YouTube video
- ⏱️ Specify custom time ranges for music recognition
- 🎯 Support for various YouTube URL formats (standard, shorts, and shortened links)
- 💫 Real-time loading states and error handling
- 🎨 Clean and responsive UI using Tailwind CSS

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components

- **Backend:**
  - Next.js API Routes
  - Python (for music recognition)
  - Prisma (database ORM)

- **Music Recognition:**
  - ShazamIO
  - yt-dlp (YouTube video processing)

## Prerequisites

- Node.js (v18 or higher)
- Python 3.x
- FFmpeg (for audio processing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-music-finder
```
2. Install Node.js dependencies:
```bash
npm install
or
yarn install
```
3. Install Python dependencies:
```bash
pip install shazamio yt-dlp
```
4. Set up your environment variables:
```bash
cp .env.example .env
```
5. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```
## Usage

1. Start the development server:
```bash
npm run dev
or
yarn dev
```
2. Open your browser and navigate to `http://localhost:3000`

3. Enter a YouTube URL and optionally specify a time range

4. Click "Find Music" to identify songs in the video

## API Endpoints

### POST `/api/identify`
Identifies music in a YouTube video

**Request Body:**
```json
{
"url": "https://youtube.com/watch?v=...",
"timeRange": {
"start": 60, // optional, in seconds
"end": 120 // optional, in seconds
}
}
```
**Response:**
```json
{
"success": true,
"data": {
"songs": [
{
"title": "Song Title",
"artist": "Artist Name"
}
]
}
}
```
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ShazamIO](https://github.com/dotX12/ShazamIO) for music recognition
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for YouTube video processing
- [Shadcn/ui](https://ui.shadcn.com/) for UI components