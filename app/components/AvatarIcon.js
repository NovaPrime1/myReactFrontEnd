import React, { useEffect } from "react"

function AvatarIcon(props) {
  const avatarIcon = ""
  const aUsername = props.username
  switch (aUsername) {
    case "corey":
      aUsername = "corey"
      console.log("AvatarIcon.aUsername : " + aUsername)
      avatarIcon = "../components/avatar1.jpg"
      console.log("AvatarIcon.avararIcon : " + avatarIcon)
      return
    case "coco":
      props.username = "coco"
      avatarIcon = "../components/avatar2.jpg"
      return
    case "jessica":
      props.username = "jessica"
      avatarIcon = "../components/avatar3.jpg"
      return
    case "clark":
      props.username = "clark"
      avatarIcon = "../components/avatar4.jpg"
      return
  }
}

export default AvatarIcon
