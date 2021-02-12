const getDB = require("pgknexlove")({
  defaults: { database: "raiders" },
  pool: { min: 0, max: 1 },
})
const { send, json } = require("micro")
const query = require("micro-query")

module.exports = async (req, res) => {
  const db = await getDB()
  const { session_id } = query(req)

  if (req.method === "GET" && !session_id) {
    send(
      res,
      200,
      await db("session")
        .where(
          "start_time",
          ">",
          db.raw("current_timestamp - (interval '240 minute')")
        )
        .select([
          "session_id",
          "session_num",
          "theme",
          "players_allowed",
          "players",
          "plan",
          "host",
          "start_time",
        ])
        .orderBy("start_time", "ASC")
    )
  } else if (req.method === "GET" && session_id) {
    // TODO check via JWT that player is one of the players allowed to access
    // the session data
    send(
      res,
      200,
      await db("session")
        .where({ session_id })
        .select([
          "session_id",
          "session_num",
          "theme",
          "players_allowed",
          "players",
          "plan",
          "host",
          "state_info",
          "player1_active",
          "player2_active",
          "player3_active",
          "player4_active",
          "start_time",
          db.raw(`
            (
              SELECT COALESCE(
                (
                  SELECT jsonb_agg(obj) FROM (
                      SELECT                 jsonb_build_object(
                        'session_command_id', session_command_id,
                        'issued_by', issued_by,
                        'command', command,
                        'created_at', session_command.created_at
                      ) as obj,
                      created_at
                    FROM session_command
                    WHERE session_command.session_id=session.session_id
                    ORDER BY session_command.created_at DESC
                    LIMIT 12
                  ) jsonb_commands
                ),
                '[]'::jsonb
              )
            ) as "recentCommands"
          `),
        ])
        .first()
    )
  } else if (req.method === "PUT" && session_id) {
    // TODO use JWT to make sure only host can update
    // TODO a player trying to add themselves to a session should use a separate endpoint

    const { session } = await json(req)

    delete session.session_id
    delete session.session_num

    await db("session").where({ session_id }).update(session)

    send(res, 200, {})
  }
  send(res, 400)
}
