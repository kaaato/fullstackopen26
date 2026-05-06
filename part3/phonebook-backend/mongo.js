const mongoose = require('mongoose')

const args = process.argv.length

if (args !== 3 && args !== 5) {
  console.log('something missing')
  process.exit(1)
}

const [ , , password, name, number] = process.argv

const url = `mongodb+srv://kaaato_db:${password}@cluster0.mxfcarb.mongodb.net/phonebookApp26?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (args === 3) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })

} else if (args === 5) {
  const person = new Person({
    name,
    number,
  })

  person.save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}



