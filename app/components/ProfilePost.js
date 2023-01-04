import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotIcon from "./LoadingDotIcon"
import StateContext from "../StateContext"
import Post from "./Post"

function ProfilePost(props) {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        // console.log(response.data)
        setPosts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log("There was a problem")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingDotIcon />

  return (
    <div className="list-group">
      {/* // Map used to iterate over a collection of information and transform them. */}
      {posts.length > 0 &&
        posts.map(post => {
          return <Post noAuthor={true} post={post} key={post._id} />
        })}
    </div>
  )
}

export default ProfilePost
