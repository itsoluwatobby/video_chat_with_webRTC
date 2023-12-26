import { useCreateRoomContext } from './hooks/useCreateRoomContext';
import { useEffect } from 'react';
import { CreateRoomContextType } from './types/vid';
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Rooms'

export default function App() {
  const { socket } = useCreateRoomContext() as CreateRoomContextType
  const navigate = useNavigate()
 
  useEffect(() => {
    // if(!socket) return
    socket.on('room-created', (data: {roomId: string}) => {
      navigate(`/room/${data.roomId}`)
    })
  }, [socket, navigate])

  return (
    <main className='w-full p-3 h-screen flex flex-col'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </main>
  )
}
