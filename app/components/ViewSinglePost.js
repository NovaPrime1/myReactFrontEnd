import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import LoadingDotIcon from "./LoadingDotIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams()
  // Set up use state for loading and give it a default value of true
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        console.log("This is the response : " + response)
        setPost(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log("ViewSinglePost: There was a problem or the request was cancelled")
      }
    }
    fetchPost()
    // Clean up functions. This will run when component is unmounted (destructor)
    // Cancel the axios requet,. But not limited to ansy network request. Here we are cancelling the requst based on the const above (ourRequest)
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      // double equal sign comparision operator to check equality. look at both left and right and return true or false
      // console.log("This is the user name from ViewSinglePost : " + post.author.username)
      return appState.user.username == post.author.username
    }
    return false
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          // 1. display a flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted" })

          // 2. redirect back to the current user profile.
          navigate(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log("There was a problem")
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      {/* src={post.author.avartar} is the correct code but does not show so used what is below */}

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src="../components/avatar1.jpg" />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        {/* {post.body}  1st way*/}
        {/* <ReactMarkdown children={post.body} /> */}
        <ReactMarkdown children={post.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
