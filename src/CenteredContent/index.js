import React from "react"
import { styled } from "@material-ui/styles"

const OuterContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const InnerContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: 1200,
  marginLeft: 32,
  marginRight: 32,
  "&.page": {
    marginTop: 32,
    marginBottom: 32,
    minHeight: "100vh",
  },
})

export const CenteredContent = ({ children, page, style }) => {
  return (
    <OuterContainer>
      <InnerContainer className={page ? "page" : ""} style={style}>
        {children}
      </InnerContainer>
    </OuterContainer>
  )
}

export default CenteredContent
