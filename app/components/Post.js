import React, { useEffect } from "react"
import { Link } from "react-router-dom"

function Post(props) {
  const post = props.post
  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

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

  const name = props.post.author.username

  return (
    <Link onClick={props.onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src="../components/avatar1.jpg" /> <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {/* {!props.noAuthor && <> by {props.post.author.username}</>} */}
        on {dateFormatted}{" "}
      </span>
    </Link>
  )
}

export default Post
