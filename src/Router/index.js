import React, { useState, useEffect } from "react"
import JoinRoom from "../JoinRoom"
import InGameRoom from "../InGameRoom"
import SchedulePage from "../SchedulePage"
import backgroundImg from "../App/background.jpg"
import glowPatternImg from "../App/glow.png"
import { useAuth0 } from "@auth0/auth0-react"
import { Arwes } from "arwes"

function getUrlParams() {
  var url = window.location.search.split("#")[0] // Discard fragment identifier.
  var urlParams = {}
  var queryString = url.split("?")[1]
  if (!queryString) {
    if (url.search("=") !== false) {
      queryString = url
    }
  }
  if (queryString) {
    var keyValuePairs = queryString.split("&")
    for (var i = 0; i < keyValuePairs.length; i++) {
      var keyValuePair = keyValuePairs[i].split("=")
      var paramName = keyValuePair[0]
      var paramValue = keyValuePair[1] || ""
      urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, " "))
    }
  }
  return urlParams
}

export const Router = () => {
  const [route, setRoute] = useState(
    window.location.search.includes("session_id") ? "room" : "schedule"
  )
  const [loading, setLoading] = useState(false)
  const { loginWithRedirect, logout } = useAuth0()
  const [routeParams, setRouteParams] = useState(getUrlParams())

  const navigate = async (route, params) => {
    if (route === "login") {
      loginWithRedirect()
      return
    }
    if (route === "logout") {
      logout({ returnTo: window.location.origin })
      return
    }

    const searchParams = new URLSearchParams()
    for (const [key, val] of Object.entries(params || {})) {
      searchParams.set(key, val)
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    )

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRouteParams(params)
    setRoute(route)
    setLoading(false)
  }

  return (
    <Arwes
      show={!loading}
      animate
      background={backgroundImg}
      pattern={glowPatternImg}
    >
      {route === "join" && <JoinRoom onNavigate={navigate} {...routeParams} />}
      {route === "room" && (
        <InGameRoom onNavigate={navigate} {...routeParams} />
      )}
      {route === "schedule" && (
        <SchedulePage onNavigate={navigate} {...routeParams} />
      )}
    </Arwes>
  )
}

export default Router
