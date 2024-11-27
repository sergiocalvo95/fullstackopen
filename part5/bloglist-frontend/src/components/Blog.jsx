import { useRef, useState } from 'react'
import  blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [details, setDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenVisible = { display: details ? 'none' : '' }
  const showWhenVisible = { display: details ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    backgroundColor: 'blue',
    borderRadius: '6px'


  }

  const addLike = async () => {
    const newBlog = {
      id: blog.id,
      user: blog.user.id,
      author: blog.author,
      url: blog.url,
      title: blog.title,
      likes: likes+1

    }

    try {
      const updatedBlog = await blogService.update(newBlog)
      setLikes(updatedBlog.likes)
    } catch (error) {
      console.error('Error updating likes:', error)

    }

  }

  const removeBlog = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        const removedBlog = await blogService.deleteBlog(blog)
        window.location.reload()
      } catch (error) {
        console.log(error)
      } }

  }


  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={() => setDetails(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={() => setDetails(false)}>hide</button> <br/>
        {blog.url} <br/>
      likes {likes} <button onClick={addLike}>like</button><br/>
        {blog.author} <br/>
        <button style={buttonStyle} onClick={removeBlog}>remove</button>
      </div>
    </div>

  )}


export default Blog