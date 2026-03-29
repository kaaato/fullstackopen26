import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const isIdentical = persons.some(person => person.name.localeCompare(newName, undefined, {sensitivity: 'accent'}) === 0)
    if (isIdentical) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }

    const nameObj = {
      name: newName,
      number: newNumber,
    }

    setPersons(persons.concat(nameObj))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = (!searchInput)
    ? persons
    : persons.filter(person => person.name.toUpperCase().includes(searchInput.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchInput={searchInput} setSearchInput={setSearchInput} />

      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addName}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App