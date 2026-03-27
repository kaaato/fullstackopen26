const PersonForm = ({ onSubmit, newName, setNewName, newNumber, setNewNumber}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <span>name:</span> 
        <input
          type='text'
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          required
        />
      </div>
      <div>
        <span>number:</span>
        <input
          type='text'
          value={newNumber}
          onChange={event => setNewNumber(event.target.value)}
          pattern='^[0-9]+([0-9]|-[0-9])+$'
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm