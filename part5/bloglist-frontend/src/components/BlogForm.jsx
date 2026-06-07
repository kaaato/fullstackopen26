import { useState, useImperativeHandle } from 'react'

const BlogForm = ({ children, user, handleLogout, createBlog, ref }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  const hideComponent = { display: (visible) ? 'none' : '', marginBlock: '15px' }
  const showComponent = { display: (visible) ? '' : 'none', marginBlock: '15px' }
  const changeVisible = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return { changeVisible }
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    }, setTitle, setAuthor, setUrl)
  }

  return (
    <div>
      <h2>Blogs</h2>
      {children}
      <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>

      <div style={hideComponent}>
        <button onClick={changeVisible}>create new blog</button>
      </div>
      <div style={showComponent}>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            <label>
              title:
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              author:
              <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              url:
              <input
                type="text"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </label>
          </div>
          <button type='submit'>create</button>
        </form>
        <button onClick={changeVisible}>cancel</button>
      </div>
    </div>
  )
}

export default BlogForm