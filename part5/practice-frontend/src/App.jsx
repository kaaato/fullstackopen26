import { useState, useEffect, useRef } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const noteFormRef = useRef(null)


  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  if(!notes) {
  /* this is called at the first render but not after the codes in the first effect hook are run, which is the second render caused by the setNotes method  */
    return null
  }

  const addNote = (noteObject) => {
    noteFormRef.current.changeVisible()
    noteService
      .create(noteObject)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
      })
  }

  const notesToShow = (showAll)
    ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const target = notes.find(note => note.id === id)

    noteService
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
    noteService
      .remove(id)
    // eslint-disable-next-line no-unused-vars
      .then(removedNote => {
        setNotes(notes.filter(note => note.id !== id))
      })
      .catch(error => console.log(error.message))
  }

  const handleLogin = async (loginObj, setUsername, setPassword) => {
    try {
      const user = await loginService
        .login(loginObj)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable text='login window'>
      <LoginForm
        processLogin={handleLogin}
      />
    </Togglable>
  )

  const noteForm = () => (
    <Togglable text='save window' ref={noteFormRef}>
      <NoteForm
        createNote={addNote}
      />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}

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

      < Footer />
    </div>

  )

}

export default App
