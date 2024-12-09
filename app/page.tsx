import { YoutubeUrlInput } from "@/components/YoutubeUrlInput";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            YouTube Music Identifier
          </h1>
          <p className="text-xl text-gray-600">
            Discover the soundtrack of any YouTube video
          </p>
        </div>
        <YoutubeUrlInput />
      </div>
    </main>
  )
}