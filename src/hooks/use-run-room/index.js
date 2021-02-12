import { useRef, useEffect } from "react"
import runGame from "./state-machine.js"
import speech from "../../speech"

function executeSpeech(command) {
  if (command.type === "SAY") {
    speech.speak({ text: command.text })
  } else if (command.type === "COUNTDOWN") {
    const from = Math.min(10, command.from)
    for (let i = from; i > 0; i--) {
      const k = command.from - i // (i=10, k=0),  (i=9, k=1)...
      // Count down slower towards the end
      const delay =
        k * 1000 + (k / from) ** 2 * (command.exp ? command.exp * 1000 : 0)
      setTimeout(() => {
        speech.speak({ text: i.toString() })
      }, delay)
    }
  }
}

export default (session, hosting) => {
  const alreadyRunCommands = useRef(new Set())
  const commandsToRun = useRef([])
  const listenStartTime = useRef(Date.now())
  const gameState = useRef(null)
  const session_id = (session || {}).session_id

  useEffect(() => {
    listenStartTime.current = Date.now()
  }, [session_id])

  useEffect(() => {
    if (!session) return
    for (const { command } of session.recentCommands) {
      if (!command.id) continue
      if (!alreadyRunCommands.current.has(command.id)) {
        alreadyRunCommands.current.add(command.id)

        if (Date.now() - listenStartTime.current > 3000) {
          commandsToRun.current.push(command)
          executeSpeech(command)
        }
      }
    }
  }, [session])

  useEffect(() => {
    if (!session_id) return
    if (!hosting) return
    gameState.current = session.state_info
    let t = 0
    setInterval(() => {
      t += 1
      const dispatch = (cmd) => {
        const id = Math.random().toString(36).slice(-10)
        alreadyRunCommands.current.add(id)
        executeSpeech(cmd)
        fetch(`/api/command`, {
          method: "POST",
          body: JSON.stringify({
            command: { ...cmd, id },
            session_id,
            player_number: 0,
          }),
          headers: { "Content-Type": "application/json" },
        })
        commandsToRun.current.push(cmd)
      }
      if (!gameState.current) {
        gameState.current = runGame({
          command: { type: "INIT" },
          plan: session.plan,
          dispatch,
        })
      }
      if (!commandsToRun.current.some((c) => c.type === "TIME")) {
        commandsToRun.current.unshift({
          type: "TIME",
          timeRemaining: gameState.current.timeRemaining - 1,
        })
      }
      for (let i = 0; i < commandsToRun.current.length && i < 20; i++) {
        gameState.current = runGame({
          command: commandsToRun.current[i],
          state: gameState.current,
          plan: session.plan,
          dispatch,
        })
      }
      commandsToRun.current.splice(0, 20)
      if (t % 5 === 0) {
        fetch(`/api/session?session_id=${session_id}`, {
          method: "PUT",
          body: JSON.stringify({
            session: { state_info: gameState.current },
          }),
          headers: { "Content-Type": "application/json" },
        })
      }
    }, 1000)
  }, [session_id, hosting])
}
