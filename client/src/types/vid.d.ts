// @type.d.vid
import { Socket } from "socket.io-client";
import Peer from "peerjs"

type RoomInfo = {
  roomId: string, 
  participants: string[]
}

type CreateRoomContextType = {
  socket: Socket,
  me: Peer | undefined,
  roomInfo: RoomInfo,
  stream: MediaStream | undefined,
  peers: Record<string, {stream: MediaStream}>,
  handleShareScreen: () => void,
}