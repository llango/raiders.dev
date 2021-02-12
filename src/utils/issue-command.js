export default ({ command, playerNumber, session_id }) => {
  const id = Math.random().toString(36).slice(-8)
  return fetch(`/api/command`, {
    method: "POST",
    body: JSON.stringify({
      command: {
        ...command,
        id,
      },
      session_id,
      player_number: playerNumber || 0,
    }),
    headers: { "Content-Type": "application/json" },
  })
}
