import React, { useEffect } from "react"

// Comments: This feature works locally but we want to abstract it so the feature can be reused.
// Need to find a better way to do this that will add avatar to header as well as profile screen - Most likely in main to propagate down to all child components
var avatarJpgLoc = ""
// const name = props.post.author.username

function AvatarIcon(props) {
  const username = props.post.author.username

  switch (username) {
    case "corey":
      username = "corey"
      avatarJpgLoc = "../components/avatar1.jpg"
      return
    case "coco":
      username = "coco"
      avatarJpgLoc = "../components/avatar2.jpg"
      return
    case "jessica":
      props.username = "jessica"
      avatarJpgLoc = "../components/avatar3.jpg"
      return
    case "clark":
      props.username = "clark"
      avatarJpgLoc = "../components/avatar4.jpg"
      return
    case "bryce":
      props.username = "bryce"
      avatarJpgLoc = "../components/avatar5.jpg"
      return
    case "tya":
      props.username = "tya"
      avatarJpgLoc = "../components/avatar6.jpg"
      return
  }
}

export default AvatarIcon
