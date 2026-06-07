import { useState } from 'react'

const Blog = ({ blog, removeBlog, updateBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const isUser = (user) ? user.name === blog.user.name : null

  const toggleButton = () => ((visible)
    ? <button onClick={() => setVisible(!visible)}>hide</button>
    : <button onClick={() => setVisible(!visible)}>view</button>
  )

  const increaseLikes = () => {
    updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const deleteBlog = () => {
    const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (isConfirmed) removeBlog(blog.id)

  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    overflow: 'hidden',
  }

  const buttonStyle = {
    backgroundColor: 'DodgerBlue ',
    border: 'solid, 1px DodgerBlue ',
    borderRadius: '5px',
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        {toggleButton()}
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={increaseLikes}>like</button></div>
          <div>added by {blog.user.name}</div>
          {isUser && (
            <button onClick={deleteBlog} style={buttonStyle}>remove</button>
          )}
        </div>
      )}

    </div>
  )
}
export default Blog