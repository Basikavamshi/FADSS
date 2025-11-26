'use client'
import { useRef } from "react"

function Welcome() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const controlVideo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.pause();
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-[0.6fr_0.4fr] p-6 bg-gradient-to-br from-green-50 to-emerald-100 items-center justify-center gap-6">
      <div className="flex flex-col gap-4 bg-gradient-to-br from-sage-100 to-green-50 p-6 rounded-xl shadow-xl border border-emerald-200">
        <div className="text-2xl font-bold text-gray-800">
          <span>Welcome To FADSS - Farming Powered by </span>
          <span className="text-emerald-800">Intelligence</span>
        </div>

        <p className="text-emerald-800 text-sm leading-relaxed">
          Experience the power of AI with smart recommendations to improve yield, reduce costs, and boost farmer income.
        </p>

        <ul className="flex flex-col gap-2 text-emerald-800 font-medium">
          <li class="flex items-center gap-2 bg-gradient-to-tr from-emerald-50 to-sage-100 shadow-sm border border-emerald-300 rounded-md p-2 cursor-pointer hover:bg-emerald-100 transition" onClick={() => controlVideo(200)} className="cursor-pointer hover:text-emerald-900 hover:underline">Crop selection</li>
          <li class="flex items-center gap-2 bg-gradient-to-tr from-emerald-50 to-sage-100 shadow-sm border border-emerald-300 rounded-md p-2 cursor-pointer hover:bg-emerald-100 transition" onClick={() => controlVideo(500)} className="cursor-pointer hover:text-emerald-900 hover:underline">Irrigation scheduling</li>
          <li class="flex items-center gap-2 bg-gradient-to-tr from-emerald-50 to-sage-100 shadow-sm border border-emerald-300 rounded-md p-2 cursor-pointer hover:bg-emerald-100 transition" onClick={() => controlVideo(600)} className="cursor-pointer hover:text-emerald-900 hover:underline">Fertilizer usage</li>
          <li class="flex items-center gap-2 bg-gradient-to-tr from-emerald-50 to-sage-100 shadow-sm border border-emerald-300 rounded-md p-2 cursor-pointer hover:bg-emerald-100 transition" onClick={() => controlVideo(700)} className="cursor-pointer hover:text-emerald-900 hover:underline">Pest management</li>
        </ul>
      </div>

      <div className="flex justify-center items-center">
        <video
          width={450}
          height={450}
          controls
          autoPlay
          loop
          ref={videoRef}
          className="rounded-xl shadow-lg border border-emerald-300"
        >
          <source src="/media/video.mp4" type="video/mp4" />
          video does not support
        </video>
      </div>
    </div>
  );
}

export default Welcome;
