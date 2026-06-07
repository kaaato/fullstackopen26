import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      sortBlogs(blogs)
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

  const emptyFields = (setFields) => {
    for (let setField of setFields) {
      setField('')
    }
  }

  const handleLogin = async (loginObj, ...setFields) => {
    try {
      const user = await loginService.login(loginObj)
      window.localStorage.setItem(
        'bloglistLoggedInUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      emptyFields(setFields)

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

  const addBlog = async (blogObj, ...setFields) => {
    try {
      blogFormRef.current.changeVisible()
      const savedBlog = await blogService.create(blogObj)
      // console.log(savedBlog)
      const allBlogs = await blogService.getAll()
      sortBlogs(allBlogs)
      emptyFields(setFields)
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

  const increaseLikes = async (id, updateObj) => {
    await blogService.update(id, updateObj)
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === id) {
        blog.likes += 1
      }
      return blog
    })

    sortBlogs(updatedBlogs)
  }

  const sortBlogs = (arrayBlogs) => {
    setBlogs([...arrayBlogs].sort((a, b) => b.likes - a.likes))
  }

  return (
    <div>
      {!user && (
        <LoginForm processLogin={handleLogin}>
          {message && (
            <Notification message={message} isSuccess={isSuccess} />
          )}
        </LoginForm>
      )}

      {user && (
        <BlogForm
          user={user}
          handleLogout={handleLogout}
          createBlog={addBlog}
          ref={blogFormRef}
        >
          {message && (
            <Notification message={message} isSuccess={isSuccess} />
          )}
        </BlogForm>
      )}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} removeBlog={deleteBlog} updateBlog={increaseLikes} user={user} />
      )}
    </div>
  )
}

export default App