const Total = ({ course }) => {
  const total = course.parts.reduce((acc, part) => acc + part.exercises, 0)

  return (
    <div>
      <p>total of {total} exercises</p>
    </div>
  )
}

export default Total