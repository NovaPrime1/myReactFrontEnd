import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"

function Post(props) {
  const appState = useContext(StateContext)
  const post = props.post
  const date = new Date(post.createdDate)
  var avatar = appState.user.avatar
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  console.log("Debug: Components:Postjs | Method: Post(props) | Note: Message before the avatarIcon function and the proops.posts")
  console.log(props.post)

  // old Link that works properly
  // <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
  // by {post.author.username} key={post._id}
  //This bit of code does not work as it should
  // {!props.noAuthor && <> by {post?.author?.username}</> }

  function avatarIcon() {
    var username = post.author.username

    switch (username) {
      case "corey":
        username = "corey"
        console.log(" Component: Postjs | Inside the avatarIcon function before return value -- corey")
        avatar = "../img/avatar1.jpg"
        console.log("Value of the post.author.avatar")
        console.log(avatar)
        return
      case "coco":
        username = "coco"
        console.log(" Component: Postjs | Inside the avatarIcon function before return value -- coco")
        avatar = "../img/avatar2.jpg"
        console.log(avatar)
        return
      case "jessica":
        username = "jessica"
        avatar = "../img/avatar3.jpg"
        console.log(avatar)
        return
      case "clark":
        username = "clark"
        console.log(" Component: Postjs | Inside the avatarIcon function before return value -- clark")
        avatar = "../img/avatar4.jpg"
        console.log(avatar)
        return
      case "bryce":
        username = "bryce"
        avatar = "../img/avatar5.jpg"
        console.log(avatar)
        return
      case "tya":
        username = "tya"
        avatar = "../img/avatar6.jpg"
        console.log(avatar)
        return
    }
  }
  avatarIcon()

  return (
    <Link onClick={props.onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={avatar} /> <strong>{post.title}</strong> <span className="text-muted small">{/* {!props.noAuthor && <> by {props.post.author.username}</>} on {dateFormatted}{" "} */}</span>
    </Link>
  )
}

export default Post
