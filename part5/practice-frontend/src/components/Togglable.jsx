import { useState, useImperativeHandle } from 'react'

const Togglable = ({ children, text, ref }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: (visible) ? 'none' : '' }
  const showWhenVisible = { display: (visible) ? '' : 'none' }
  const changeVisible = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return { changeVisible }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={changeVisible}>open {text}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={changeVisible}>close {text}</button>
      </div>
    </div>
  )
}


export default Togglable