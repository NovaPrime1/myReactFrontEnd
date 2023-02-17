import React, { useEffect } from "react"

function FlashMessages(props) {
  var alertClassNames = "..."

  if (props.alertType === "undefined" || props.alertType == null) {
    alertClassNames = "alert alert-success text-center floating-alert shadow-sm"
  }

  switch (props.alertType) {
    case "primary":
      alertClassNames = "alert alert-primary text-center floating-alert shadow-sm"
      break

    case "success":
      alertClassNames = "alert alert-success text-center floating-alert shadow-sm"
      break

    case "warning":
      alertClassNames = "alert alert-warning text-center floating-alert shadow-sm"
      break

    case "danger":
      alertClassNames = "alert alert-danger text-center floating-alert shadow-sm"
      break
  }

  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className={alertClassNames}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
