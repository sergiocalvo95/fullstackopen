import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import AddBlog from './components/AddBlog'
import Notification from './components/Notification'
import Error from './components/Error'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'




const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [newNotification, setNewNotification] = useState(null)
  const [newError, setNewError] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const addBlogRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  const addBlog = async (newBlog) => {

    addBlogRef.current.toggleVisibility()
    try {
      const blog = await blogService.create(newBlog)
      setBlogs([...blogs, blog])
      setNewNotification(`${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)

    } catch (error) {
      console.log(error)
    }

  }


  const handleClear = () => {
    localStorage.removeItem('loggedBlogUser')
    window.location.reload()

  }



  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNewError('wrong username or password')
      setTimeout(() => {
        setNewError(null)
      }, 5000)
    }
  }

  return (
    <div>

      {user === null ?
        <div>
          <h2>log in to application</h2>
          <Error message={newError}></Error>
          {loginForm()}
        </div>
        :
        <div>
          <h2>blogs</h2>
          <Notification message={newNotification}></Notification>
          <p>{user.name} logged-in <button onClick={handleClear}>logout</button></p>
          <Togglable buttonLabel='create new blog' cancelLabel = 'cancel' ref={addBlogRef}>
            <AddBlog createBlog = {addBlog}/>
          </Togglable>
          {blogs
            .slice()
            .sort((a,b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </div>
      }

    </div>
  )
}

export default App