import React, { useState } from "react"
import { RecoilRoot } from "recoil"
import { styled } from "@material-ui/styles"
import {
  ThemeProvider,
  SoundsProvider,
  createTheme,
  Arwes,
  Button,
  Words,
  createSounds,
  Project,
} from "arwes"
import backgroundImg from "./background.jpg"
import glowPatternImg from "./glow.png"
import infoSound from "./information.mp3"
import warningSound from "./warning.mp3"
import errorSound from "./error.mp3"
import askSound from "./ask.mp3"
import clickSound from "./click.mp3"
import typingSound from "./typing.mp3"
import deploySound from "./deploy.mp3"
import Router from "../Router"
import { Auth0Provider } from "@auth0/auth0-react"

const mySounds = createSounds({
  shared: { volume: 1 },
  players: {
    information: { sound: { src: [infoSound] } },
    click: { sound: { src: [clickSound] } },
    deploy: { sound: { src: [deploySound] } },
    ask: { sound: { src: [askSound] } },
    typing: { sound: { src: [typingSound] } },
    warning: { sound: { src: [warningSound] } },
    error: { sound: { src: [errorSound] } },
  },
})

const AssholeProvider = styled("div")(() =>
  window.localStorage.is_asshole
    ? {
        "&&&&&& *": {
          fontFamily: "'Comic Sans MS'",
        },
      }
    : {}
)

function App() {
  return (
    <ThemeProvider theme={createTheme()}>
      <SoundsProvider sounds={createSounds(mySounds)}>
        <AssholeProvider>
          <Auth0Provider
            domain="seveibar.us.auth0.com"
            clientId="Who7uw1RtiYKS35OIBukkJWTWryB7Ejb"
            redirectUri={window.location.origin}
          >
            <RecoilRoot>
              <Router />
            </RecoilRoot>
          </Auth0Provider>
        </AssholeProvider>
      </SoundsProvider>
    </ThemeProvider>
  )
}

export default App
