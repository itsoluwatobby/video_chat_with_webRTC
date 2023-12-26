import { createContext, useEffect, useState, useReducer } from 'react'
import { connect } from 'socket.io-client'
import { CreateRoomContextType, RoomInfo } from '../types/vid'
import Peer from "peerjs"
import { v4 as uuidV4 } from "uuid"
import { peerReducer } from './peerReducer'
import { addPeerAction, removePeerAction } from './peerActions'

type RoomContextProps = {
  children: React.ReactNode
}
const URL = 'http://localhost:5000'
export const CreateRoomContext = createContext<CreateRoomContextType | null>(null)

const socket = connect(URL)
export default function RoomContext({ children }: RoomContextProps) {
  const [me, setMe] = useState<Peer>()
  const [stream, setStream] = useState<MediaStream>();
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({ roomId: '', participants: [] })
  const [screenSharingId, setScreenSharingId] = useState<string>()
  const [peers, dispatch] = useReducer(peerReducer, {})

  useEffect(() => {
    const meId = uuidV4()
    setMe(new Peer(meId))
    try{
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((stream) => {
        setStream(stream)
      })
    }
    catch(error){
      console.log(error)
    }

  }, [])

  useEffect(() => {
    if(!stream || !me) return
    socket.on('user-joined', ({ peerId }) => {
      const call = me.call(peerId, stream)
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream))
      })
    })
    me.on('call', (call) => {
      call.answer(stream)
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream))
      })
    })

    socket.on('get-users', (data: RoomInfo) => {
      setRoomInfo(data)
    })
    socket.on('user-disconnected', (data: {peerId: string}) => {
      dispatch(removePeerAction(data.peerId))
    })
  }, [me, stream])

  const switchScreen = (stream: MediaStream) => {
    setStream(stream)
    setScreenSharingId(me?._id ?? '')
  }

  const handleShareScreen = () => {
    if(screenSharingId){
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(switchScreen)
    }
    else{
      navigator.mediaDevices.getDisplayMedia({})
      .then((stream) => setStream(stream))
    }

    Object.values(me?.connections).forEach((connection: any) => {
      const videoTrack = stream?.getTracks().find(track => track.kind === 'video');
      connection[0].peerConnection.getSenders()[1].replaceTrack(videoTrack)
      .catch((error: any) => {
        console.error(error)
      })
    })
  }

  const value = {
    socket, me, roomInfo, stream, peers, handleShareScreen
  }
  return (
    <CreateRoomContext.Provider value={value}>
      {children}
    </CreateRoomContext.Provider>
  )
}
