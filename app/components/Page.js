import React, { useEffect } from "react"
import Container from "./Container"

function Page(props) {
  useEffect(() => {
    // Only run the first time the page is rendered
    document.title = `${props.title} | ComplexApp`
    window.scrollTo(0, 0)
    // Added to update every time page is rendered. Fixes above
  }, [props.title])
  return <Container wide={props.wide}>{props.children}</Container>
}

export default Page
