import { YoutubeUrlInput } from "@/components/YoutubeUrlInput";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Identify Music in Youtube Videos
        </h1>
        <p className="text-center text-gray-600">
          Simply paste a Youtube URL to discover what songs are playing in the video
        </p>
        <YoutubeUrlInput />
      </div>

    </main>
  )
}