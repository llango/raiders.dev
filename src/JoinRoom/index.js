import React, { useState } from "react"
import CenteredContent from "../CenteredContent"
import { styled } from "@material-ui/styles"
import { Project, Words, Button, Loading, Heading } from "arwes"
import TextInput from "../TextInput"
import { useAuth0 } from "@auth0/auth0-react"

const ButtonContainer = styled("div")({
  position: "fixed",
  right: 10,
  bottom: 10,
  "& > *": {
    margin: 8,
  },
})

export const JoinRoom = ({ show, onNavigate }) => {
  const [roomCode, setRoomCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [errorText, setErrorText] = useState("")
  const { user, isAuthenticated } = useAuth0()
  return (
    <CenteredContent page>
      <Project
        show={!loading}
        header={
          !isAuthenticated ? "Welcome Raider" : `Welcome ${user.nickname}`
        }
        animate
      >
        <Words animate show={!loading}>
          Enter the room code below to begin.
        </Words>
        {errorText && (
          <div>
            <Words layer="alert" animate show={!loading && errorText}>
              {errorText}
            </Words>
          </div>
        )}
        <div>
          <TextInput
            show={!loading}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
          />
          {!loading && (
            <Button
              show={roomCode && !loading}
              animate
              disabled={!roomCode}
              layer="success"
              onClick={async () => {
                setLoading(true)
                setLoadingText("Finding Room...")
                await new Promise((resolve) => setTimeout(resolve, 2000))
                if (roomCode.toLowerCase() === "raids") {
                  onNavigate("room")
                } else {
                  setErrorText("Room not found")
                  setLoading(false)
                }
              }}
              style={{ marginLeft: 24 }}
            >
              Submerge
            </Button>
          )}
        </div>
      </Project>
      {loading && (
        <div style={{ marginTop: -30 }}>
          <Loading animate full show={loading} />
          <Heading layer="alert" node="h1">
            {loadingText}
          </Heading>
        </div>
      )}
      <ButtonContainer>
        {!isAuthenticated ? (
          <Button onClick={() => onNavigate("login")}>Login</Button>
        ) : (
          <Button onClick={() => onNavigate("logout")}>Logout</Button>
        )}
        <Button onClick={() => onNavigate("schedule")}>Schedule</Button>
        <Button
          onClick={() => {
            setLoading(true)
            if (window.localStorage.is_asshole) {
              setLoadingText("Too bad asshole!")
              setTimeout(() => {
                setLoading(false)
              }, 2000)
            } else {
              setLoadingText("Fixing design...")
              setTimeout(() => {
                window.localStorage.is_asshole = "true"
                window.location.reload()
              }, 3000)
            }
          }}
          layer="alert"
        >
          {!window.localStorage.is_asshole
            ? "I don't like this design"
            : "I actually did like the old design!"}
        </Button>
      </ButtonContainer>
    </CenteredContent>
  )
}

export default JoinRoom
