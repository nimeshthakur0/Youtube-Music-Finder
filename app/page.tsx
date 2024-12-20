import { YoutubeUrlInput } from "@/components/YoutubeUrlInput";

export default function Home() {
  return (
      <div className="container mx-auto p-4">
          <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  YouTube Music Finder
              </h1>
              <p className="text-xl text-gray-600">
                  Discover the soundtrack of any YouTube video
              </p>
          </div>
          <YoutubeUrlInput />
      </div>
  )
}