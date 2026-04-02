import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    personServices
      .getAll()
      .then(initialList => setPersons(initialList))
      .catch(error => console.log(error))
  }, [])

  const updatePerson = (person) => {
    console.log(person)
    personServices.update(person.id, {
      ...person,
      number: newNumber,
    })
    .then(savedPerson => {
      setPersons(persons.map(person => (person.id === savedPerson.id)
        ? savedPerson
        : person)
      )
      alert(`${savedPerson.name}'s number is updated from ${person.number} to ${savedPerson.number}`)
      setNewName('')
      setNewNumber('')
    })
    .catch(error => console.log(error.message))
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    
    let identicalPerson;
    const isIdentical = persons.find(person => {
      if (person.name.localeCompare(newName, undefined, {sensitivity: 'accent'}) === 0) {
        identicalPerson = person
        return true
      }
    })
    if (isIdentical) {
      const isConfirmed = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (isConfirmed) updatePerson(identicalPerson)
      return 
    }

    const personObj = {
      name: newName,
      number: newNumber,
    }

    personServices
      .create(personObj)
      .then(savedPerson => {
        setPersons(persons.concat(savedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => console.log(error.message))
  }

  const deletePersonOf = (id) => {
    personServices.remove(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
      .catch(error => console.log(error.message))
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
        onSubmit={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePersonOf} />
    </div>
  )
}

export default App