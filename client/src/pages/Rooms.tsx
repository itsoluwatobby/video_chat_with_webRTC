import { useParams } from "react-router-dom"
import {useEffect } from 'react'
import { useCreateRoomContext } from "../hooks/useCreateRoomContext"
import { VideoPlayer } from '../components/VideoPlayer'
import { PeerState } from "../roomContext/peerReducer"
import { ShareScreenButton } from "../components/ShareScreenButton"

export default function Rooms() {
  const { id: roomId } = useParams()
  const { socket, me, stream, roomInfo, peers, handleShareScreen } = useCreateRoomContext()

console.log(roomInfo)

  useEffect(() => {
    socket.emit('join-room', { roomId, peerId: me?._id })
  }, [roomId, socket, me?._id])

  return (
    <>
      Room ID: {roomId}
      <div className="grid grid-cols-4 gap-4">
        <VideoPlayer stream={stream as MediaStream} />

        {Object.values(peers as PeerState).map(peer => (
          <VideoPlayer stream={peer.stream} />
          ))}
      </div>
      <div  className="fixed bottom-0 p-6 w-full flex justify-center border-t-2">
        <ShareScreenButton handleShare={handleShareScreen} />
      </div>
    </>
  )
}