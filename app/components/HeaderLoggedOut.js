import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

import FlashMessages from "./FlashMessages"
import NotFound from "./NotFound"
import LoadingDotIcon from "./LoadingDotIcon"

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  //console.log("Debug: Components:HeaderLoggedOut | Function: HeaderLoggedOut(props) | Note: Before the handleSubmit function")

  async function handleSubmit(e) {
    e.preventDefault()

    if (username === "undefined" || username == null) {
      let uNameElement = document.getElementsByClassName("form-control form-control-sm input-dark")[0]
      uNameElement.classList.add("is-invalid")
      appDispatch({ type: "flashMessage", value: "The username is blank", alertType: "warning" })
      return
    }
    if (password === "undefined" || password == null) {
      let pWordElement = document.getElementsByClassName("form-control form-control-sm input-dark")[1]
      pWordElement.classList.add("is-invalid")
      appDispatch({ type: "flashMessage", value: "The password is blank", alertType: "warning" })
      return
    }

    try {
      const response = await Axios.post("/login", { username, password })
      // console.log("Debug: Components:HeaderLoggedOut | Function: handleSubmit(e) | Note: In try block after Axios call")
      if (response.data) {
        appDispatch({ type: "login", data: response.data })
        appDispatch({ type: "flashMessage", value: " Congratuations! You have successfully logged in ", alertType: "success" })
      } else {
        // console.log("Incorrect Username / password.")
        appDispatch({ type: "flashMessage", value: "Invalid username and password combination !!", alertType: "warning" })
      }
    } catch (e) {
      console.log("There was a problem")
    }
  }

  //console.log("Debug: Components:HeaderLoggedOut | Function: HandleSubmit(e) | Note: Before the return statement")

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
