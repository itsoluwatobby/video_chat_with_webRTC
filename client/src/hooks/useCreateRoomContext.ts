import { useContext, Context } from "react"
import { CreateRoomContext } from "../roomContext/RoomContext"
import { CreateRoomContextType } from "../types/vid"

export const useCreateRoomContext = () => {
  return useContext<CreateRoomContextType>(CreateRoomContext as Context<CreateRoomContextType>)
}