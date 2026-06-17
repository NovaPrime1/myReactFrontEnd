import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreatePost(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function getCreatedPostId(data) {
    if (typeof data === "string" && data.length > 0) {
      return data
    }

    if (data && typeof data === "object") {
      const raw = data._id || data.id || data.post?._id || data.post?.id
      return raw && typeof raw === "object" ? raw.toString() : raw
    }

    return ""
  }

  function getCreatePostErrorMessage(error) {
    const responseData = error?.response?.data

    if (Array.isArray(responseData) && responseData.length > 0) {
      return responseData.join(" ")
    }

    if (typeof responseData === "string" && responseData.trim().length > 0) {
      return responseData
    }

    if (responseData && typeof responseData === "object") {
      if (typeof responseData.message === "string" && responseData.message.trim().length > 0) {
        return responseData.message
      }

      if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        return responseData.errors.join(" ")
      }
    }

    return "There was a problem creating the post. Please try again."
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const createPostPayload = { title, body, token: appState.user.token }
      console.log("Create-post request payload", {
        title,
        body,
        bodyLength: typeof body === "string" ? body.length : 0,
        hasToken: Boolean(appState.user?.token)
      })

      const response = await Axios.post("/create-post", createPostPayload)
      console.log("Create-post response", {
        status: response?.status,
        data: response?.data,
        dataType: typeof response?.data
      })

      let createdPostId = getCreatedPostId(response.data)

      if (!createdPostId) {
        const postsResponse = await Axios.get(`/profile/${appState.user.username}/posts`)
        const matchingPosts = Array.isArray(postsResponse.data)
          ? postsResponse.data.filter(post => post.title === title && post.body === body)
          : []

        if (matchingPosts.length > 0) {
          matchingPosts.sort((firstPost, secondPost) => new Date(secondPost.createdDate) - new Date(firstPost.createdDate))
          createdPostId = matchingPosts[0]._id
        }
      }

      if (!createdPostId) {
        console.error("Unexpected create-post response shape:", response.data)
        throw new Error("Create post response did not include a post id")
      }

      // Redirect to new post URL
      appDispatch({ type: "flashMessage", value: "Congrats you have created a new post", alertType: "success" })
      navigate(`/post/${createdPostId}`)
    } catch (e) {
      console.error("Create post failed", {
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message
      })
      appDispatch({ type: "flashMessage", value: getCreatePostErrorMessage(e), alertType: "danger" })
    }
  }
  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
