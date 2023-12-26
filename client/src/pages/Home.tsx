import { useCreateRoomContext } from '../hooks/useCreateRoomContext'
import { Socket } from 'socket.io-client';

export default function Home() {
  const { socket } = useCreateRoomContext()

  return (
    <main className='w-full p-3 h-screen flex flex-col'>
      <CreateRoom socket={socket} />
    </main>
  )
}


type Props = {
  socket: Socket
}
const CreateRoom = ({ socket }: Props) => {

  return (
    <button 
    onClick={() => socket.emit('create-room', 'room')}
    className='px-5 py-2 m-auto bg-green-400 rounded-md w-fit hover:bg-green-600 active:bg-green-500 text-white transition-colors'>
      Start a meeting
    </button>
  )
}