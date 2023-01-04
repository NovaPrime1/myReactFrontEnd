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

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
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

  console.log("MainJS: Main() Function, before reducer")

  function ourReducer(draft, action) {
    console.log("MainJS: 1st Function ourReducer- Case switch")
    switch (action.type) {
      case "login":
        // Immer replace useReducers calls to the entire object. Immer give a draft we can modify
        // return { loggedIn: true, flashMessages: state.flashMessages }
        draft.loggedIn = true
        // pull 3 valuse from state instead of local storage
        draft.user = action.data
        return
      case "logout":
        // return { loggedIn: false, flashMessages: state.flashMessages }
        draft.loggedIn = false
        return
      case "flashMessage":
        // return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) }
        draft.flashMessages.push(action.value)
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

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      console.log("MainJS: 1st UseEffect: Watching state.loggedIn for user information : " + state.loggedIn)
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

  // useEffect(() => {
  //   if (state.loggedIn) {
  //     const username = state.user.username
  //     switch (username) {
  //       case "corey":
  //         username = "corey"
  //         avatarJpgLoc = "../components/avatar1.jpg"
  //         return
  //       case "coco":
  //         username = "coco"
  //         avatarJpgLoc = "../components/avatar2.jpg"
  //         return
  //       case "jessica":
  //         props.username = "jessica"
  //         avatarJpgLoc = "../components/avatar3.jpg"
  //         return
  //       case "clark":
  //         props.username = "clark"
  //         avatarJpgLoc = "../components/avatar4.jpg"
  //         return
  //       case "bryce":
  //         props.username = "bryce"
  //         avatarJpgLoc = "../components/avatar5.jpg"
  //         return
  //       case "tya":
  //         props.username = "tya"
  //         avatarJpgLoc = "../components/avatar6.jpg"
  //         return
  //     }
  //   } else {
  //     console.log("Username not found")
  //   }
  // }, [state.loggedIn])

  //Recreated function using useReducer
  //const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")))
  //const [flashMessages, setFlashMessages] = useState([])
  // function addFlashMessage(msg) {
  //   setFlashMessages(prev => prev.concat(msg))
  // }

  // Check if token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      console.log("MainJS: 2st UseEffect: Watching state.loggedIn for token expiry : " + state.loggedIn)
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          console.log("Inside the try block for useEffect on loggedIn and here is the value :" + state.loggedIn)
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

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense>
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
