import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const showRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const increaseVoteByOne = () => {
    const copied = [...votes]
    copied[selected] += 1
    setVotes(copied)
  }

  const getMaxVotes = () => {
    return Math.max(...votes)
  }

  const getIndexOfMostVotedAnecdote = () => {
    return votes.indexOf(getMaxVotes())
  }

  const showMostVotedAnecdote = () => {
    if (getMaxVotes() === 0) {
      return (
        <div>no vote yet</div>
      )
    }

    return (
      <div>
        <div>{anecdotes[getIndexOfMostVotedAnecdote()]}</div>
        <div>has {getMaxVotes()} votes</div>
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>
        {anecdotes[selected]}
      </div>
      <div>has {(!votes[selected]) ? 0 : votes[selected]} votes</div>
      <button onClick={increaseVoteByOne}>vote</button>
      <button onClick={showRandomAnecdote}>next anecdote</button>

      <h2>Anecdote with most votes</h2>
      {
        showMostVotedAnecdote()
      }
    </div>
  )
}

export default App
