import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
Axios.defaults.baseURL = process.env.BACKENDURL || "https://myreactbackendtest-novaprime.onrender.com"
import { createRoot } from "react-dom/client"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

//My Components
//import CreatePost from "./components/CreatePost"
//import ViewSinglePost from "./components/ViewSinglePost"
// import ExampleContext from "./Example"
// const Search = React.lazy(() => import("./components/Search"))
// import Chat from "./components/Chat"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
import Search from "./components/Search"
const Chat = React.lazy(() => import("./components/Chat"))
import LoadingDotIcon from "./components/LoadingDotIcon"

// Main program notes:
// pull 3 value from state instead of local storage
// Immer replace useReducers calls to the entire object. Immer give a draft we can modify
// NOTE: Not keep alive token set for a log expiry for working with the session need to lower that to 10 minutes.

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    alertType: "...",
    // User app availbile to global and application state.
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
  }

  // console.log("Debug: Components:MainjS | Method: Main() | Note: User Object created and initialized")

  function ourReducer(draft, action) {
    // console.log("MainJS: 1st Function ourReducer- Case switch")
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        //  Please note : draft.user = action.data - This is the original statement. But did username, tokent but directly set the avatar based on username
        // Below is the code to set the avatar in state for each of the users
        // First set username and the token first
        draft.user.username = action.data.username
        draft.user.token = action.data.token

        // If statements for each user will pulls their avatar file and set it in state.
        if (draft.user.username == "corey") {
          draft.user.avatar = "../img/avatar1.jpg"
        }

        if (draft.user.username == "coco") {
          draft.user.avatar = "../img/avatar2.jpg"
        }

        if (draft.user.username == "jessica") {
          draft.user.avatar = "../img/avatar3.jpg"
        }

        if (draft.user.username == "clark") {
          draft.user.avatar = "../img/avatar4.jpg"
        }
        if (draft.user.username == "bryce") {
          draft.user.avatar = "../img/avatar5.jpg"
        }

        if (draft.user.username == "tya") {
          draft.user.avatar = "../img/avatar6.jpg"
        }
        return

      case "logout":
        draft.loggedIn = false
        return

      case "flashMessage":
        draft.flashMessages.push(action.value)
        draft.alertType = action.alertType
        return

      case "openSearch":
        draft.isSearchOpen = true
        return

      case "closeSearch":
        draft.isSearchOpen = false
        return

      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return

      case "closeChat":
        draft.isChatOpen = false
        return

      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return

      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
        return
    }
  }
  // console.log("Debug: Components:MainjS | Method: Main() | Function: OurReducer ")

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      // console.log("*******MainJS: 1st UseEffect: Watching state.loggedIn for user information :**** " + state.flashMessages)
      // save data to local storage but pulled from state instead of local storage
      localStorage.setItem("complexappToken", state.user.token)
      localStorage.setItem("complexappUsername", state.user.username)
      localStorage.setItem("complexappAvatar", state.user.avatar)
    } else {
      // Remove remove from local stroage
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      localStorage.removeItem("complexappAvatar")
    }
  }, [state.loggedIn])

  // Check if token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          // console.log(response.data)
          if (!response.data) {
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "You session has expired. Please log in again" })
          }
        } catch (e) {
          console.log(" There was a problem or the request was cancelled")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  // console.log("Debug: Components:MainjS | Method: Main() | Return with JSX with routes and inside StateContext")

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} alertType={state.alertType} />
          <Header />
          <Suspense fallback={<LoadingDotIcon />}>
            <Routes>
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const container = document.querySelector("#app")
const root = createRoot(container)
root.render(<Main />)

// ReactDOM.createRoot does not work in v18 need to update it to the above
// const root = ReactDOM.createRoot(document.querySelector("#app"))
// root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
