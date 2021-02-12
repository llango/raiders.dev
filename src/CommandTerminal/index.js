import React, { useState } from "react"
import TextInput from "../TextInput"
import { styled } from "@material-ui/styles"

const TextArea = styled("textarea")({
  fontSize: 11,
  background: "none",
  caretColor: "#26dafd",
  opacity: 0.75,
  border: "1px solid rgb(2, 157, 187)",
  outline: "none",
  verticalAlign: "bottom",
  padding: 10,
  "&:focus": {
    border: "1px solid rgb(2, 157, 187)",
  },
  color: "#0f0",
  width: "100%",
  height: 170,
})

export const CommandTerminal = ({ onSubmit, commands = [] }) => {
  commands = [...commands]
    .map((c) => ({ ...c.command, issued_by: c.issued_by }))
    .slice(0, 11)
  commands.reverse()
  const [commandText, setCommandText] = useState("")
  return (
    <>
      <TextArea
        value={
          "\n\n\n\n\n\n\n\n\n\n\n\n".slice(0, 11 - commands.length) +
          commands
            .map((cmd) => {
              return (
                `P${cmd.issued_by}: ` +
                cmd.type +
                " " +
                Object.entries(cmd)
                  .filter(
                    ([k, v]) => k !== "type" && k !== "id" && k !== "issued_by"
                  )
                  .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                  .join(" ")
              )
            })
            .join("\n")
        }
      />
      <TextInput
        value={commandText}
        onChange={(e) => setCommandText(e.target.value)}
        show
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const type = commandText.split(" ")[0]
            const stringMatches = [
              ...(commandText + " ").matchAll(/([a-zA-Z_]+)="([^"]+)"/g),
            ]
            const numMatches = [
              ...(commandText + " ").matchAll(/([a-zA-Z_]+)=([0-9.]+)/g),
            ]
            const obj = { type }
            for (const match of stringMatches) {
              obj[match[1]] = match[2]
            }
            for (const match of numMatches) {
              obj[match[1]] = parseFloat(match[2])
            }
            setCommandText("")
            onSubmit(obj)
          }
        }}
      />
    </>
  )
}

export default CommandTerminal
