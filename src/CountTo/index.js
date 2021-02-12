import React, { useState, useEffect } from "react"
import moment from "moment"
import countdown from "countdown"

export const CountTo = ({ to }) => {
  const [time, setTime] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, 500)
    return () => {
      clearInterval(interval)
    }
  })
  const { months, days, hours, minutes, seconds } = countdown(
    Date.now(),
    moment(to).toDate()
  )
  return (
    <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
      {months === 0 ? "    " : months.toString().padStart(2, " ") + "mo "}
      {days === 0 && !months ? "    " : days.toString().padStart(2, " ") + "d "}
      {hours === 0 && !days && !months
        ? "   "
        : hours.toString().padStart(2, "0") + ":"}
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  )
}
export default CountTo
