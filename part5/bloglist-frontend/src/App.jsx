import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('bloglistLoggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const emptyFields = (...setFields) => {
    for (let setField of setFields) {
      setField('')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`username: ${username}, password: ${password}`)

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem(
        'bloglistLoggedInUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      emptyFields(setUsername, setPassword)

    } catch {
      setMessage('wrong username or password')
      setIsSuccess(false)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('bloglistLoggedInUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogObj = {
        title,
        author,
        url,
      }
      const savedBlog = await blogService.create(blogObj)
      setBlogs(blogs.concat(savedBlog))
      emptyFields(setTitle, setAuthor, setUrl)
      setMessage(`A new blog ${savedBlog.title} by ${savedBlog.author} added`)
      setIsSuccess(true)
      setTimeout(() => {
        setMessage('')
      }, 5000)

    } catch (error) {
      setMessage(error.response.data.error)
      setIsSuccess(false)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {message && (
          <Notification message={message} isSuccess={isSuccess} />
        )}
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input 
                type="text"
                value={username}
                onChange={({target}) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input 
                type="password"
                value={password}
                onChange={({target}) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {message && (
        <Notification message={message} isSuccess={isSuccess} />
      )}
      <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>
      
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input 
              type="text"
              value={title}
              onChange={({target}) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input 
              type="text"
              value={author}
              onChange={({target}) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input 
              type="text"
              value={url}
              onChange={({target}) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} deleteBlog={() => deleteBlog(blog.id)} />
      )}
    </div>
  )
}

export default App