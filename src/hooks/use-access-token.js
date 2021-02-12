import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"

const tokenParams = {
  audience: "https://seveibar.us.auth0.com/api/v2/",
  scope: "read:current_user",
}

export default () => {
  const {
    isAuthenticated,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0()
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    getAccessTokenSilently(tokenParams)
      .catch(() => getAccessTokenWithPopup(tokenParams))
      .then((accessToken) => {
        setToken(accessToken)
      })
    // eslint-disable-next-line
  }, [isAuthenticated])

  return token
}
