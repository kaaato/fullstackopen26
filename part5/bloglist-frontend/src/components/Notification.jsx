const Notification = ({ message, isSuccess }) => {
  const css = (isSuccess)
    ? 'message success'
    : 'message error'

  return (
    <div className={css}>
      {message}
    </div>
  )
}

export default Notification