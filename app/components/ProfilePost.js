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
        //console.log("Debug: Components:ProfilePostjs | Method: ProfilePost(props) | Note: fetchPosts(). logging response data")
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

  console.log("Now let see what the posts oject looks like after it is set and avatar is passed in ")
  // posts.author.avatar = appState.user.avatar
  console.log(posts)

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
// new content - recommended if you have not created any post.
//     <div className="list-group">
//       {posts.length > 0 &&
//         posts.map(post => {
//           return <Post noAuthor={true} post={post} key={post._id} />
//         })}
//       {posts.length == 0 && appState.user.username == username && (
//         <p className="lead text-muted text-center">
//           You haven&rsquo;t created any posts yet; <Link to="/create-post">create one now!</Link>
//         </p>
//       )}
//       {posts.length == 0 && appState.user.username != username && <p className="lead text-muted text-center">{username} hasn&rsquo;t created any posts yet.</p>}
//     </div>
//   )
// }

export default ProfilePost
