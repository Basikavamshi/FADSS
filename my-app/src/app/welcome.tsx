'use client'
import { useRef } from "react"
function Welcome() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const controlVideo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.pause();
    }
    
  }
  return (
    <div className='grid grid-cols-[0.6fr_0.4fr] grid-rows-[1fr] items-center justify-center justify-items-center box-border p-2.5'>
        <div className='grid grid-flow-row grid-col-[1fr]'>
           <div><span>Welcome To FADSS -Farming Powered by </span><span>Intelligence</span></div>
           <p>Experience the power of AI with smart recommendations to improve yield, reduce costs, and boost farmer income.</p>
           <ul>
              <li onClick={()=>controlVideo(200)}>crop selection</li>
              <li onClick={()=>controlVideo(500)}>irrigation sheduling</li>
              <li onClick={()=>controlVideo(600)}>fertilizer usage</li>
              <li onClick={()=>controlVideo(700)}>pest management</li>
           </ul>
        </div>
        <div>
           <video width={450} height={450} controls autoPlay loop ref={videoRef}>
             <source src="/media/video.mp4" type="video/mp4"  />
             vidoe does not support
           </video>
        </div>
    </div>
  )
}

export default Welcome