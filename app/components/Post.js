import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import AvatarIcon from "./AvatarIcon"

function Post(props) {
  const post = props.post

  // Comments: This feature works locally but we want to abstract it so the feature can be reused.
  var username = ""
  var avatarJpgLoc = ""
  function assignAvatarIcon() {
    username = props.post.author.username
    switch (username) {
      case "corey":
        username = "corey"
        avatarJpgLoc = "../components/avatar1.jpg"
        return
      case "coco":
        username = "Coco"
        avatarJpgLoc = "../components/avatar2.jpg"
        return
    }
  }
  assignAvatarIcon()

  // This is the new parameter for src
  // src={avatarJpgLoc} />
  // src="../components/avatar1.jpg" -- old value

  // old Link that works properly
  // <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
  // Second Change
  // by {post.author.username}
  // Third change is removing the key. The outter component is providing the key for us.
  // key={post._id}
  //This bit of code does not work as it should
  // {!props.noAuthor && <> by {post?.author?.username}</> }
  //

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  const name = props.post.author.username

  // if (!name == "") {
  //   console.log("This is the value of name in if statement : " + name)
  //   return <AvatarIcon />
  // }

  return (
    <Link onClick={props.onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={avatarJpgLoc} /> <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {/* {!props.noAuthor && <> by {props.post.author.username}</>} */}
        on {dateFormatted}{" "}
      </span>
    </Link>
  )
}

export default Post
