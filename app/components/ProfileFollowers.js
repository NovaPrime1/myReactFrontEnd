import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotIcon from "./LoadingDotIcon"

function ProfileFollowers(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token })
        // console.log(response.data)
        setPosts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log("ProfilePost: There was a problem or the request was cancelled")
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
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/pofile/:username`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollowers
