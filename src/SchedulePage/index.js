import React, { useState } from "react"
import CenteredContent from "../CenteredContent"
import { styled } from "@material-ui/styles"
import { Project, Words, Button, Loading, Heading, Table, Link } from "arwes"
import { Arwes } from "arwes"
import moment from "moment"
import CountTo from "../CountTo"
import Backdrop from "@material-ui/core/Backdrop"
import { useAuth0 } from "@auth0/auth0-react"
import { useSessionListPolling } from "../hooks/use-session.js"

export const gameDefs = {
  "All In": {
    description:
      "In All In, all players work towards the completion of a single challenging issue.",
    duration: 30 * 60 * 1000,
  },
  Ambush: {
    description:
      "In Ambush, each player selects an issue on the same repository. If a player finishes early, they can help another player complete their issue. To complete an ambush, every player must submit a PR that plausibly fixes an issue. The players lose the Ambush after 30 minutes if they haven't all created PRs.",
    duration: 30 * 60 * 1000,
  },
  "Help Wanted": {
    description:
      "In Help Wanted, the players spend the first 5 minutes finding a Github issue with Help Wanted on it. After selecting their issue, the players spend 15 minutes creating a pull request to try to fix that issue. The players lose if they don't submit a PR in less than 15 minutes.",
    duration: 20 * 60 * 1000,
  },
}

const TableItem = styled("div")({
  padding: 8,
})

const ButtonContainer = styled("div")({
  position: "fixed",
  right: 10,
  bottom: 10,
  "& > *": {
    margin: 8,
  },
})

export const SchedulePage = ({ onNavigate }) => {
  const [infoDialog, setInfoDialog] = useState({ open: false })
  const { user, isAuthenticated } = useAuth0()
  const sessions = useSessionListPolling()

  return (
    <CenteredContent page>
      <Project
        animate
        header="Schedule"
        show={!infoDialog.open && Boolean(sessions)}
      >
        <Table
          show={!infoDialog.open && Boolean(sessions)}
          animate
          headers={["Starts In", "Date", "Time", "Theme", "Games", "", ""]}
          dataset={(sessions || []).map((session) =>
            [
              <CountTo to={session.start_time} />,
              moment(session.start_time).format("ddd MMM Do"),
              moment(session.start_time).format("LT"),
              session.theme,
              <div>
                {session.plan.map((game, i) =>
                  game.gameName ? (
                    <Link
                      style={{ display: "block" }}
                      onClick={() => {
                        setInfoDialog({
                          title: game.gameName,
                          content:
                            gameDefs[game.gameName].description +
                            "\n\n" +
                            (game.repo
                              ? `The repo selected for this session is: ${game.repo}`
                              : ""),
                          open: true,
                        })
                      }}
                    >
                      {moment(gameDefs[game.gameName].duration).minutes() *
                        (game.times || 1)}
                      m {game.gameName}{" "}
                      {game.times && game.times !== 1 ? `(${game.times}x)` : ""}
                    </Link>
                  ) : (
                    <div>
                      {moment(game.duration).minutes()}m {game.name}
                    </div>
                  )
                )}
              </div>,
              <div style={{ margin: 8, textAlign: "center" }}>
                {user && session.players.includes(user.nickname) ? (
                  <Button
                    onClick={async () => {
                      setInfoDialog({
                        open: true,
                        title: "Raid Left",
                        content: `You have left the raid and your comrades. Your cowardice is beyond redemption.`,
                        layer: "alert",
                      })
                      await fetch(
                        `/api/session?session_id=${session.session_id}`,
                        {
                          method: "PUT",
                          body: JSON.stringify({
                            session: {
                              players: session.players.filter(
                                (p) => p !== user.nickname
                              ),
                            },
                          }),
                          headers: { "Content-Type": "application/json" },
                        }
                      )
                    }}
                    layer="alert"
                  >
                    Leave ({session.players.length}/{session.players_allowed})
                  </Button>
                ) : session.players.length < session.players_allowed ? (
                  <Button
                    onClick={async () => {
                      if (!isAuthenticated) {
                        setInfoDialog({
                          open: true,
                          title: "Not Logged In",
                          content: "You must be logged in to join a raid.",
                          layer: "alert",
                        })
                      } else {
                        setInfoDialog({
                          open: true,
                          title: "Raid Joined",
                          content: `You have joined a raid. You'll be playing with [${session.players.join(
                            ","
                          )}]. You'll receive a room code via email or via a message from the host (${
                            session.host
                          }).`,
                        })
                        await fetch(
                          `/api/session?session_id=${session.session_id}`,
                          {
                            method: "PUT",
                            body: JSON.stringify({
                              session: {
                                players: session.players.concat([
                                  user.nickname,
                                ]),
                              },
                            }),
                            headers: { "Content-Type": "application/json" },
                          }
                        )
                        await sessions.update()
                      }
                    }}
                  >
                    Join ({session.players.length}/{session.players_allowed})
                  </Button>
                ) : (
                  <Button disabled>
                    Full ({session.players.length}/{session.players_allowed})
                  </Button>
                )}
              </div>,
              user && session.players.includes(user.nickname) ? (
                <div style={{ margin: 8, textAlign: "center" }}>
                  <Button
                    onClick={() =>
                      onNavigate("room", { session_id: session.session_id })
                    }
                    layer="success"
                  >
                    Enter Room
                  </Button>
                </div>
              ) : null,
            ].map((item, i) => <TableItem key={i}>{item}</TableItem>)
          )}
        />
      </Project>
      <Backdrop
        open={infoDialog.open}
        onClick={() => setInfoDialog({ ...infoDialog, open: false })}
        style={{ zIndex: 100 }}
      >
        <CenteredContent page>
          <Project
            header={infoDialog.title}
            animate
            show
            style={{ maxWidth: "50%" }}
          >
            <Words style={{ whiteSpace: "pre-wrap" }} animate show>
              {infoDialog.content}
            </Words>
          </Project>
        </CenteredContent>
      </Backdrop>
      <ButtonContainer>
        {!isAuthenticated ? (
          <Button onClick={() => onNavigate("login")}>Login</Button>
        ) : (
          <Button onClick={() => onNavigate("logout")}>Logout</Button>
        )}
        <Button onClick={() => onNavigate("join")}>Join a Room</Button>
      </ButtonContainer>
    </CenteredContent>
  )
}

export default SchedulePage
