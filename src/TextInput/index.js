import React from "react"
import { styled } from "@material-ui/styles"
import classnames from "classnames"

const Input = styled("input")({
  fontSize: 15.75,
  background: "none",
  color: "#26dafd",
  caretColor: "#26dafd",
  marginTop: 16,
  marginBottom: 16,
  border: "1px solid rgb(2, 157, 187)",
  outline: "none",
  padding: 10,
  transition: "opacity 100ms",
  opacity: 0,
  "&.show": { opacity: 1 },
  "&::placeholder": {
    opacity: 0.5,
  },
  "&:focus": {
    border: "1px solid rgb(2, 157, 187)",
  },
})

export const TextInput = ({ show, ...props }) => {
  return <Input {...props} className={classnames({ show })} />
}

export default TextInput
