import { useState, useEffect, useRef } from "react"
import useEventCallback from "use-event-callback"
import useAccessToken from "./use-access-token"

export const useSessionPolling = (session_id) => {
  const [room, setRoom] = useState(null)
  const timeout = useRef(null)
  const token = useAccessToken()

  const updateRoomState = async () => {
    const newRoom = await fetch(`/api/session?session_id=${session_id}`)
      .then((r) => r.json())
      .catch((e) => {
        console.log(`Something went wrong trying to load room: ${e.toString()}`)
        return null
      })
    if (timeout.current === null) return
    if (newRoom) {
      setRoom(newRoom)
    }
    timeout.current = setTimeout(() => {
      updateRoomState()
    }, 2000)
  }

  useEffect(() => {
    if (!session_id || !token) return
    timeout.current = setTimeout(() => {}, 2000)
    updateRoomState()

    return () => {
      clearTimeout(timeout.current)
      timeout.current = null
    }
    // eslint-disable-next-line
  }, [session_id, token])

  const changeRoom = useEventCallback(async (changes) => {
    clearTimeout(timeout.current)
    timeout.current = null
    setRoom({ ...room, ...changes })
    await fetch(`/api/session?session_id=${session_id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((r) => r.json())
    timeout.current = setTimeout(() => {
      updateRoomState()
    }, 2000)
  })

  return [room, changeRoom]
}

export default useSessionPolling
