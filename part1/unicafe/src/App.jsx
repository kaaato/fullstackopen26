import { useState } from 'react'

const StatisticLine = ({ text, value}) => <tr><th>{text}</th><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (!total) ? 0 : (good + -bad) / total
  const positive = (!total) ? 0 : good / total * 100 + '%'

  if (!total) {
    return (
      <div>No feedback given</div>
    )
  }
  
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={total} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive} />
      </tbody>
    </table>
  )
}

const Button = ({ text, onClick }) => {

  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickOnGood = () => setGood(good + 1)
  const handleClickOnNeutral = () => setNeutral(neutral + 1)
  const handleClickOnBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>

      <Button text='good' onClick={handleClickOnGood} />
      <Button text='neutral' onClick={handleClickOnNeutral} />
      <Button text='bad' onClick={handleClickOnBad} />
      
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App