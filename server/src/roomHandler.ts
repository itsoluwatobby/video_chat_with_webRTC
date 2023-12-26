import { Socket } from 'socket.io'
import { v4 as uuidV4 } from 'uuid'

const rooms: Record<string, string[]> = {}

 interface RoomParams{
    roomId: string
    peerId: string
 }
export const roomHandler = (socket: Socket) => {
  const createRoom = (arg: string) => {
    const roomId = uuidV4()
    socket.emit('room-created', { roomId })
  }

  const joinRoom = (arg: RoomParams) => {
    if(!arg.peerId) return
    if (rooms?.hasOwnProperty(arg.roomId)) rooms[arg.roomId].push(arg.peerId)
    else rooms[arg.roomId] = [arg.peerId]
    socket.join(arg.roomId)

    socket.to(arg.roomId).emit('user-joined', { peerId: arg.peerId })

    socket.emit('get-users', {
      roomId: arg.roomId,
      participants: rooms[arg.roomId]
    })

    socket.on('disconnect', () => {
      leaveRoom(arg)
    })
  }

  const leaveRoom = (arg: RoomParams) => {
    const otherUsers = rooms[arg.roomId].filter(user => user !== arg.peerId)
    rooms[arg.roomId] = otherUsers
    socket.emit('user-disconnected', { peerId: arg.peerId})
    console.log(`User with ${arg.peerId} left`)
  }

  socket.on('create-room', (join) => createRoom(join))
  socket.on('join-room', (join) => joinRoom(join))
}