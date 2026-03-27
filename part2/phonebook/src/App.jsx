import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')

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