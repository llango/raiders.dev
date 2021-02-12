const getDB = require("pgknexlove")({
  defaults: { database: "raiders" },
  pool: { min: 0, max: 1 },
})
const { send, json } = require("micro")
// const jwt = require("jsonwebtoken")
// const fs = require("fs")
// const jwks = fs.readFileSync("../lib/jwks.json").toString()

module.exports = async (req, res) => {
  const db = await getDB()

  if (req.method !== "POST") {
    send(res, 400, "only post allowed")
    return
  }

  const { session_id, command, player_number } = await json(req)

  if (!session_id) {
    send(res, 400, "Missing session_id")
    return
  }

  if (!command) {
    send(res, 400, "Missing command")
    return
  }

  // if (!req.headers.authorization) {
  //   send(res, 401, "Missing authorization")
  //   return
  // }
  // const { sub } = jwt.verify(req.headers.authorization, jwks)

  await db("session_command").insert({
    session_id,
    command,
    issued_by: player_number,
  })

  send(res, 200)
}
