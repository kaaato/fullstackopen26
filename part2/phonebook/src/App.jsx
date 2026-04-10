import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(true)


  useEffect(() => {
    personServices
      .getAll()
      .then(initialList => setPersons(initialList))
      .catch(error => console.log(error))
  }, [])

  const emptyFields = (setFunc1, setFunc2) => {
    setFunc1('')
    setFunc2('')
  }

  const showMessage = (text, isSuccess) => {
    setMessage(text)
    setShowSuccess(isSuccess)
    setTimeout(() => {
      setMessage('')
    }, 5000);
  }

  const updatePerson = (person) => {
    personServices.update(person.id, {
      ...person,
      number: newNumber,
    })
    .then(savedPerson => {
      setPersons(persons.map(person => (person.id === savedPerson.id)
        ? savedPerson
        : person)
      )
      const text = `${savedPerson.name}'s number is updated from ${person.number} to ${savedPerson.number}`
      showMessage(text, true)
      emptyFields(setNewName, setNewNumber)
    })
    .catch((error) => {
      console.log(error)
      const text = `Information of ${person.name} has already been removed from the server`
      showMessage(text, false)
      setPersons(persons.filter(p => p.id !== person.id))
      emptyFields(setNewName, setNewNumber)
    })
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
        const text = `Added ${savedPerson.name}`
        showMessage(text, true)
        emptyFields(setNewName, setNewNumber)
      })
      .catch(error => console.log(error.message))
  }

  const deletePersonOf = (id) => {
    personServices.remove(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
        const text = `Deleted ${deletedPerson.name}`
        showMessage(text, true)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const personsToShow = (!searchInput)
    ? persons
    : persons.filter(person => person.name.toUpperCase().includes(searchInput.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} showSuccess={showSuccess} />
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