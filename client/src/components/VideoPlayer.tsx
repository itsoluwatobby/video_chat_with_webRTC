import { useRef, useEffect } from "react"

type VideoPlayerProps = {
  stream: MediaStream
}

export const VideoPlayer = ({ stream }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current){
      videoRef.current.srcObject = stream as MediaStream
    }
  }, [videoRef, stream])

  return (
    <video 
      ref={videoRef}
      autoPlay
      muted
      // width={1000}
      // height={400}
    />
  )
}