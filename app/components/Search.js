import React, { useEffect, useContext, useState } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import Axios from "axios"
import { Link } from "react-router-dom"
import Post from "./Post"

function Search() {
  const appDispatch = useContext(DispatchContext)
  const [posts, setPosts] = useState([])
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  })

  // listening for a document wide key press using eventListener. To close search using the escape key
  // We also do the clean up with the removeEventListener. Stop listing for an event (Side effect )
  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler)
    //  below is a clean up function. removing the EventListener
    return () => document.removeEventListener("keyup", searchKeyPressHandler)
  }, [])

  // Make sure you know what useEffect does in react. Pls review
  useEffect(() => {
    // console.log("This is the state object for searchTerm :" + state.searchTerm)
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading"
      })
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++
        })
      }, 750)
      return () => clearTimeout(delay)
    } else {
      setState(draft => {
        draft.show = "neither"
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          // console.log("Inside the try block and this is value searchTerm :" + state.searchTerm)
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
          // console.log(response.data)
          setState(draft => {
            draft.results = response.data
            draft.show = "results"
          })
        } catch (e) {
          console.log(" There was a problem or the request was cancelled")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.requestCount])

  function searchKeyPressHandler(e) {
    // every key on the keyboard has a unique number or code
    if (e.keyCode == 27) {
      console.log("Here is the event object " + e)
      appDispatch({ type: "closeSearch" })
    }
  }

  function handleInput(e) {
    console.log("Inside the handleInput")
    const value = e.target.value
    // console.log("Here is the inout value: " + value)
    setState(draft => {
      draft.searchTerm = value
    })
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map(post => {
                  return <Post post={post} key={post._id} onClick={() => appDispatch({ type: "closeSearch" })} />
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger test-center shadow-sm">Sorry we could not find any results for that search.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
