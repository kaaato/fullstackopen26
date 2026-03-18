const Header = ({ course }) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Part = ({ title, number }) => {
  return (
    <div>
      <p>{title} {number}</p>
    </div>
  )
}

const Total = ({ total }) => {
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Part title={part1} number={exercises1} />
      <Part title={part2} number={exercises2} />
      <Part title={part3} number={exercises3} />
      <Total total={ exercises1 + exercises2 + exercises3 } />
    </div>
  )
}

export default App
