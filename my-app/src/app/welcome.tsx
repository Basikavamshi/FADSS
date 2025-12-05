'use client'
import { useRef } from "react"


function Welcome() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const controlVideo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const features = [
    { icon: "🌾", text: "Crop Selection", time: 0, color: "green-500" },
    { icon: "💧", text: "Irrigation Scheduling", time: 10, color: "blue-500" },
    { icon: "🌱", text: "Fertilizer Usage", time: 20, color: "yellow-500" },
    { icon: "🐛", text: "Pest Management", time: 30, color: "red-500" },
  ];

  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br 
      from-green-50 to-emerald-100 
      grid grid-cols-1 
      lg:grid-cols-[0.6fr_0.4fr] 
      gap-6 lg:gap-10 
      items-center 
      justify-center 
      p-4 sm:p-6 lg:p-12
    ">
      
      {/* Left Content */}
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-800">
          Welcome To FADSS - 
          <span className="text-green-600"> Farming Powered by Intelligence</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          Experience the power of AI with smart recommendations to improve yield, reduce costs, and boost farmer income.
        </p>

        <div className="mt-2 sm:mt-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Explore Our Features:
          </h3>

          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li
                key={i}
                onMouseEnter={() => controlVideo(feature.time)}
                className={`
                  flex items-center gap-3 p-4 
                  bg-white rounded-lg shadow-md 
                  hover:shadow-lg hover:scale-[1.03] 
                  transition-all duration-300
                  border-l-4 border-${feature.color}
                `}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className='text-gray-800 font-medium'>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Content - Video */}
      <div className="flex justify-center items-center w-full">
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2 w-full max-w-sm sm:max-w-md md:max-w-lg">
          <video
            controls
            autoPlay
            loop
            ref={videoRef}
            className="rounded-lg w-full h-auto"
          >
            <source src="/media/video.mp4" type="video/mp4" />
            Video not supported
          </video>
        </div>
      </div>

    </div>
  );
}

export default Welcome;