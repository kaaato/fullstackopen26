import { useState, useEffect } from 'react'
import noteServices from './services/notes'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  
  useEffect(() => {
    noteServices
    .getAll()
    .then(initialNotes => setNotes(initialNotes))
  }, [])
  
  if(!notes) { 
  /* this is called at the first render but not after the codes the effect hook are run, which is the second render caused by the setNotes method  */
    return null
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    }

    noteServices
      .create(noteObject)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = (showAll)
    ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const target = notes.find(note => note.id === id)

    noteServices
      .update(id, {
        ...target,
        important: !target.important
      })
      .then(updatedNote => {
        const update = notes.map(note => (id === note.id) 
          ? updatedNote
          : note
        )
        setNotes(update)
      })
      .catch(error => {
        console.log(error.message)
        
        setErrorMessage(
          `Note '${target.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const deleteNoteOf = (id) => {
    noteServices
    .remove(id)
    .then(removedNote => {
      setNotes(notes.filter(note => note.id !== removedNote.id))
    })
    .catch(error => console.log(error.message))
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            deleteNote={() => deleteNoteOf(note.id)}
            />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
        < Footer />
    </div>
  )
}

export default App
