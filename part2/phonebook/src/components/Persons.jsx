const Persons = ({ personsToShow, deletePerson }) => {
  const confirmBeforeDelete = (name, id) => {
    const isConfirmed = confirm(`Delete ${name} ?`)
    if (isConfirmed) deletePerson(id)
  }

  return (
    <div>
      {personsToShow.map(person => 
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => confirmBeforeDelete(person.name, person.id)}>delete</button>
        </div>
      )}
    </div>
  )
}

export default Persons