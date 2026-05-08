require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
// eslint-disable-next-line no-unused-vars
morgan.token('person', (request, response) => JSON.stringify(request.body))
morgan.format('postOnly', ':method :url :status :res[content-length] - :response-time ms :person')

app.use(morgan('tiny', {
  // eslint-disable-next-line no-unused-vars
  skip(request, response) {
    return request.method === 'POST'
  }
}))

app.use(morgan('postOnly', {
  // eslint-disable-next-line no-unused-vars
  skip(request, response) {
    return request.method !== 'POST'
  }
}))

app.get('/api/persons', (request, response) => {
  Person.find({})
    .exec()
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
  Person.find({})
    .exec()
    .then(persons => {
      const numberOfPeople = persons.length
      const currentTime = new Date()
      response.send(
        `<div>Phonebook has info for ${numberOfPeople} people</div>
        <div>${currentTime}</div>`
      )
    })


})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .exec()
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    // eslint-disable-next-line no-unused-vars
    .then(deletedPerson => {
      response.status(204).end()
    })
    .catch(err => next(err))

})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name,
    number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(err => next(err))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body
  const id = request.params.id

  Person.findById(id)
    .exec()
    .then(person => {
      if(!person) {
        response.status(404).end()
      }

      person.number = number

      return person.save()
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
    })
    .catch(err => next(err))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})