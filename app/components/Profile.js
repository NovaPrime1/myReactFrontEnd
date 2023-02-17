import React, { useEffect, useContext, useState } from "react"
import Page from "./Page"
import { useParams, NavLink, Routes, Route } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"
import ProfilePost from "./ProfilePost"
import ProfileFollowers from "./ProfileFollowers"
import ProfileFollowing from "./ProfileFollowing"
import { useImmer } from "use-immer"
import NotFound from "./NotFound"

function Profile() {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isUserNotFound: "...",
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "...",
      // profileAvatar: "http://1.gravatar.com/avatar/55cc61cb1efaebcb894b7e1d7b365870",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" }
    }
  })
  // Set up use state for loading and give it a default value of true
  // Added userState above in react and after if condiction I setPost and setUserFound
  // const [isUserFound, setIsUserFound] = useState(true)
  // const isNotFound = false

  useEffect(() => {
    console.log("ProfileJS: UseEffect : Watching username : " + username)

    // Added this to reset each time we call the useEffect
    if (username) {
      setState(draft => {
        draft.isUserNotFound = true
      })
    }
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        if (!response.data) {
          setIsUserFound()
          console.log(" The user was not found in DB")
        } else {
          setState(draft => {
            draft.isUserNotFound = false
            draft.profileData = response.data
            draft.profileData.profileAvatar = appState.user.avatar
          })
        }
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = Axios.CancelToken.source()

      async function fetchData() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          setState(draft => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
            draft.followActionLoading = false
          })
        } catch (e) {
          console.log("There was a problem")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = Axios.CancelToken.source()

      async function fetchData() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          setState(draft => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
            draft.followActionLoading = false
          })
        } catch (e) {
          console.log("There was a problem")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])

  // {
  //   /* <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
  //   <img className="avatar-small" src="../components/avatar1.jpg" /> {state.profileData.profileUsername}*/
  //   // {appState.loggedIn && !state.profileData.isFollowing && appState.user.username == state.profileData.profileUsername && state.profileData.profileUsername == "..." && (
  // }

  function setIsUserFound() {
    setState(draft => {
      draft.isUserNotFound = true
    })
  }
  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }

  function pSlowDown() {
    console.log("Trying to delay the NotFound page")
  }

  // src={state.profileData.profileAvatar} -- old entry
  // console.log("ProfileJs: This is the profileData object")
  // console.log(state.profileData)

  if (state.isUserNotFound) {
    return <NotFound />
  }

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Stop Following <i className="fas fa-user-plus"></i>
          </button>
        )}
      </h2>

      {/* Took out the "end" for the first NavLink because it tossed an error - Warning: Received  'true' for a non-boolean attribute 'end' 
        <NavLink to="" end className=" nav-item nav-link"> -- does not show the button*/}
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" className=" nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className=" nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className=" nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<ProfilePost />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  )
}

export default Profile
