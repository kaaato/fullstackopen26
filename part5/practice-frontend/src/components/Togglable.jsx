import { useState, useImperativeHandle } from 'react'

const Togglable = ({ children, text, ref }) => {
  const [visible, setVisible] = useState(false)

  const hideComponent = { display: (visible) ? 'none' : '' }
  const showComponent = { display: (visible) ? '' : 'none' }
  const changeVisible = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return { changeVisible }
  })

  return (
    <div>
      <div style={hideComponent}>
        <button onClick={changeVisible}>open {text}</button>
      </div>
      <div style={showComponent}>
        {children}
        <button onClick={changeVisible}>close {text}</button>
      </div>
    </div>
  )
}


export default Togglable