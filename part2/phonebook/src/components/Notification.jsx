const Notification = ({ message, showSuccess}) => {
  if (!message) {
    return null
  }

  const css = (showSuccess)
    ? 'message success'
    : 'message error'
  
  return (
    <div className={css}>
      {message}
    </div>
  )
}

export default Notification