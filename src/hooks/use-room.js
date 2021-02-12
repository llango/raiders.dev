import { useEffect } from "react"
import { atom, selector, DefaultValue, useRecoilState } from "recoil"

export const roomState = atom({
  key: "roomState",
  default: null,
})

export const roomCodeState = selector({
  key: "roomCodeState",
  get: ({ get }) => {
    const roomState = get(roomState)
    if (!roomState) {
      return null
    } else {
      return roomState.code
    }
  },
  set: ({ set }, newCode) =>
    set(
      roomState,
      newCode instanceof DefaultValue
        ? newCode
        : !newCode
        ? null
        : { code: newCode }
    ),
})

export const useRoom = () => {
  return useRecoilState(roomState)
}

export const useRoomPolling = () => {
  const [room, setRoom] = useRecoilState(roomState)

  useEffect(() => {
    if (!room || !room.session_id) return
    let timeout
    const updateRoomState = async () => {
      const newRoom = await fetch(`/api/session?session_id=${room.session_id}`)
        .then((r) => r.json())
        .catch((e) => {
          console.log(
            `Something went wrong trying to load room: ${e.toString()}`
          )
          return null
        })
      if (newRoom) {
        setRoom(newRoom)
      }
      timeout = setTimeout(() => {
        updateRoomState()
      }, 500)
    }
    updateRoomState()

    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line
  }, [])
}
