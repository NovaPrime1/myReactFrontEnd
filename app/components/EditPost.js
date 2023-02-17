import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import LoadingDotIcon from "./LoadingDotIcon"
import StateContext from "../StateContext"
// Importing App wide dispatch thanks to context.
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"
import FlashMessages from "./FlashMessages"

function EditPost(props) {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const orignalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    // Allow is to pop a message, color button or disable. All logic can live in a reducer
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }
  // This is what should happen to our state when this action ("fetchComplete") occurs.
  // What happend when fetchComplete we add the new state into our object orignalState
  // Remmeber our value property is the response.data we get back from the server.
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        // This help if black it out then add something back
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case "bodyChange":
        // This help if black it out then add something back
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "submitRequest":
        // Only if both title and body are errors free
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "You must provide a title."
          // You could also add multiple if state to check for different rule.
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "You must provide a body."
          // You could also add multiple if state to check for different rule.
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  // ourReducer is the function and orignalState is the object that hold the orignal state. This also allow for client side validation.
  const [state, dispatch] = useImmerReducer(ourReducer, orignalState)
  // const { id } = useParams()

  function submitHandler(e) {
    e.preventDefault()
    // Calling the title rules before the submitt to check if submit is done with blank
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "FlashMessage", value: "You do not have permision to edit that post.", alertType: "warning" })
            // redirect to homepage
            navigate("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (error) {
        console.log("ViewSinglePost: There was a problem or the request was cancelled")
      }
    }
    fetchPost()
    // Clean up functions. This will run when component is unmounted (destructor)
    // Cancel the axios requet
    return () => {
      ourRequest.cancel()
    }
  }, [])

  //Duplicate copy
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()
      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post was updated.", alertType: "success" })
        } catch (error) {
          console.log("ViewSinglePost: There was a problem or the request was cancelled")
        }
      }
      fetchPost()
      // Clean up functions. This will run when component is unmounted (destructor)
      // Cancel the axios requet
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <Link className="small front-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to the post permalink{" "}
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  )
}

export default EditPost
