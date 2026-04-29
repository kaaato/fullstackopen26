const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.use(express.json())
morgan.token('person', (request, response) => JSON.stringify(request.body))
morgan.format('postOnly', ':method :url :status :res[content-length] - :response-time ms :person')
app.use(express.static('dist'))

app.use(morgan('tiny', {
  skip(request, response) {
    return request.method === 'POST'
  }
}))

app.use(morgan('postOnly', {
  skip(request, response) {
    return request.method !== 'POST'
  }
}))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const numberOfPeople = persons.length
  const currentTime = new Date()
  response.send(
    `<div>Phonebook has info for ${numberOfPeople} people</div>
    <div>${currentTime}</div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  const isNameIdentical = persons.find(person => {
    if (person.name.localeCompare(name, undefined, {sensitivity: 'base'}) === 0) {
      return true
    }
  })

  if(!(name && number)) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  } else if (isNameIdentical) {
    return response.status(400).json({
      error: 'name musu be unique'
    })
  }

  const person = {
    id: generateId(),
    name,
    number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})