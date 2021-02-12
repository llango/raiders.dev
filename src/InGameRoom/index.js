import React, { useState } from "react"
import { styled } from "@material-ui/styles"
import { Project, Words, Button, Loading, Heading, Link, Row, Col } from "arwes"
import CenteredContent from "../CenteredContent"
import ReactTwitchEmbedVideo from "react-twitch-embed-video"
import useSessionPolling from "../hooks/use-session-polling"
import Grid from "@material-ui/core/Grid"
import TextInput from "../TextInput"
import CommandTerminal from "../CommandTerminal"
import useRunRoom from "../hooks/use-run-room"
import speech from "../speech"
import { useAuth0 } from "@auth0/auth0-react"
import range from "lodash/range"
import issueCommand from "../utils/issue-command"

const IFrame = styled("iframe")({
  border: "none",
  transition: "opacity 100ms",
  "&.loading": {
    opacity: 0,
  },
})
const Spacing = styled("div")({ "& > *": { margin: 8 } })
const toMinSecs = (n) => {
  const minutes = Math.floor(n / 60)
  const seconds = n % 60
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
}

export const InGameRoom = ({ session_id }) => {
  let [loading, setLoading] = useState(false)
  const { user } = useAuth0()
  const [bigCamera, setBigCamera] = useState(false)
  const [timeUntilScreenOnYou, setTimeUntilScreenOnYou] = useState("1:43")
  const [playerNumber, setPlayerNumber] = useState(null)
  const [session, changeSession] = useSessionPolling(session_id)
  useRunRoom(session, playerNumber === 0)
  const fakeLoad = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
  }
  if (!session) loading = true
  const sendCommand = (command) =>
    issueCommand({ command, playerNumber, session_id })
  const [showing, setShowing] = useState([
    "playerNumber",
    // "camera",
    // "screen",
    // "status",
    // "stream",
  ])
  const playerNumberSelected = async (e) => {
    const number = parseInt(e.target.innerHTML) - 1
    setPlayerNumber(number)
    sendCommand({
      type: "PLAYER_ACTIVE",
      player: number,
    })
    speech.speak({ text: "Welcome... Raider " + (number + 1) })
    await fakeLoad()
    setShowing(["camera"])
  }
  const inStream = showing.includes("stream")
  return (
    <CenteredContent page>
      <Grid container>
        <Grid xs={!inStream ? 12 : 7}>
          {!showing.includes("playerNumber") && (
            <Project
              style={{ marginTop: 32, width: !inStream ? 450 : undefined }}
              show={!loading && showing.includes("camera")}
              animate
              header="Add Camera and Join Chat"
            >
              {showing.includes("camera") && !inStream && (
                <Words animate show={!loading}>
                  You'll be able to talk to other people in the stream after you
                  connect.
                </Words>
              )}
              <IFrame
                src={`https://obs.ninja/?room=lamebearcam&push=lamebearcamp${playerNumber}&webcam`}
                width={!inStream ? 400 : 600}
                allow="camera;microphone"
                title="camera"
                className={
                  loading || !showing.includes("camera") ? "loading" : ""
                }
                height={bigCamera ? 400 : 240}
              ></IFrame>
              {showing.includes("camera") && (
                <div style={{ textAlign: "right" }}>
                  {showing.includes("screen") && (
                    <Button onClick={() => setBigCamera(!bigCamera)}>
                      {bigCamera ? "Make Smaller" : "Make Bigger"}
                    </Button>
                  )}
                  <Button
                    onClick={async () => {
                      await fakeLoad()
                      setShowing(["screen"])
                      setBigCamera(false)
                    }}
                  >
                    Camera Added
                  </Button>
                </div>
              )}
            </Project>
          )}
        </Grid>
        <Grid item xs={!inStream ? 12 : 5}>
          {showing.includes("playerNumber") && (
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex" }}>
                <Project show={!loading} animate header="Select Your Player">
                  {!loading && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {range(4).map((n) => (
                        <Button
                          key={n}
                          layer={
                            (session.state_info?.activePlayers || []).includes(
                              n
                            )
                              ? "alert"
                              : session.players.indexOf(user.nickname) !== n
                              ? undefined
                              : "success"
                          }
                          onClick={playerNumberSelected}
                          animate
                        >
                          {n + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </Project>
              </div>
            </div>
          )}
          <div style={{ marginTop: 32 }} />
          <div style={{ textAlign: "center" }}>
            {showing.includes("screen") && (
              <Project
                show={!loading}
                animate
                header="Share Desktop"
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                }}
              >
                {!showing.includes("stream")
                  ? !loading && (
                      <div animate show={!loading}>
                        Don't share audio. Try to use an external or{" "}
                        <Link href="https://askubuntu.com/a/998435">
                          virtual monitor
                        </Link>{" "}
                        with 720p resolution. This is better than switching
                        between applications. Make sure your text is BIG in your
                        terminal and editor. Mute yourself by hitting the mic
                        (to save bandwidth) in this window.
                      </div>
                    )
                  : null}
                <div style={{ marginTop: 16 }}>
                  <IFrame
                    src={`https://obs.ninja/?room=lamebearscreen&push=lamebearscreenp${playerNumber}&view&screenshare&noaudio&novideo`}
                    width="300"
                    className={loading ? "loading" : ""}
                    height={240}
                  ></IFrame>
                </div>
                {!inStream && (
                  <div style={{ textAlign: "right" }}>
                    <Button
                      onClick={async () => {
                        await fakeLoad()
                        setShowing(["status", "stream", "camera", "screen"])
                      }}
                    >
                      Desktop Added
                    </Button>
                  </div>
                )}
              </Project>
            )}
          </div>
        </Grid>
        <Grid xs={12}>
          {inStream && (
            <>
              <Col s={12}>
                <Project
                  style={{ marginTop: 32 }}
                  header="Status"
                  animate
                  show={!loading}
                >
                  <Grid container>
                    <Grid item xs={8}>
                      <Heading>
                        Current Game: {session?.state_info?.currentTitle} {"(+"}
                        {toMinSecs(session?.state_info?.timeRemaining)})
                      </Heading>
                      <Heading>
                        Spotlight:{" "}
                        {
                          (session?.players || [])[
                            session?.state_info?.spotlight?.player
                          ]
                        }
                      </Heading>
                      <Spacing>
                        <Button
                          onClick={() => {
                            sendCommand({
                              type: "SPOTLIGHT",
                              player: playerNumber || 0,
                              until: session?.state_info?.timeRemaining - 60,
                            })
                          }}
                        >
                          Steal Spotlight
                        </Button>
                        <Button>Leave</Button>
                      </Spacing>
                    </Grid>
                    <Grid item xs={4}>
                      <CommandTerminal
                        commands={session ? session.recentCommands : []}
                        onSubmit={(cmd) => {
                          sendCommand(cmd)
                        }}
                      />
                    </Grid>
                  </Grid>
                </Project>
                <Project
                  style={{ marginTop: 32 }}
                  header="Stream"
                  animate
                  show={!loading}
                >
                  <ReactTwitchEmbedVideo channel="opensourceraiders" />
                </Project>
                {window.localStorage.is_admin && (
                  <Project
                    style={{ marginTop: 32 }}
                    header="Admin"
                    animate
                    show={!loading}
                  >
                    <Spacing>
                      {range(4).map((n) => (
                        <Button
                          key={n}
                          onClick={() => {
                            sendCommand({
                              type: "KICK_PLAYER",
                              player: n,
                            })
                          }}
                          disabled={
                            !(session.state_info?.activePlayers || []).includes(
                              n
                            )
                          }
                          layer="alert"
                        >
                          Kick {n + 1}
                        </Button>
                      ))}
                    </Spacing>
                  </Project>
                )}
              </Col>
            </>
          )}
        </Grid>
      </Grid>
    </CenteredContent>
  )
}

export default InGameRoom

{
  /* <iframe
  src="https://obs.ninja/?room=lamebear&webcam&novideo"
  width="400"
  allow="camera;microphone"
  height="400"
></iframe>
<iframe
  src="https://obs.ninja/?room=lamebear&view&screenshare&noaudio&novideo"
  width="400"
  height="400"
></iframe> */
}
