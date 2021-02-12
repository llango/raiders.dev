import { useMemo, useEffect, useState } from "react"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import { useAuth0 } from "@auth0/auth0-react"
import useEventCallback from "use-event-callback"

const sessionState = atom({
  key: "sessionState",
  default: {},
})

export const useSessionListPolling = () => {
  const [sessionList, setSessionList] = useState(null)

  let lastTimeout
  const updateSessionList = useEventCallback(async () => {
    setSessionList(await fetch("/api/session").then((r) => r.json()))
    lastTimeout = setTimeout(updateSessionList, 2000)
  })

  useEffect(() => {
    updateSessionList()
    clearTimeout(lastTimeout)
    lastTimeout = setTimeout(updateSessionList, 2000)
    return () => clearTimeout(lastTimeout)
  }, [])

  if (sessionList) {
    sessionList.update = updateSessionList
  }

  return sessionList
}
