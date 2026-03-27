const Filter = ({ searchInput, setSearchInput }) => {
  return (
    <div>
      <span>filter shown with</span>
      <input 
        type="text"
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
      />
    </div>
  )
}

export default Filter