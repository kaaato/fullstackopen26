const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://kaaato_db:${password}@cluster0.mxfcarb.mongodb.net/noteApp26?appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.where('important')
  .equals('true')
  .exec()
  .then(returned => {
    console.log(returned)
    mongoose.connection.close()
  })

/* const note = new Note({
  // content: 'HTML is easy',
  // content: 'CSS is Hard',
  content: 'Mongoose makes things easy',
  important: true,
}) */

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// const note = Note.deleteMany({ content: "HTML is easy" })

// note.then(returned => {
//   console.log(returned)
//   mongoose.connection.close()
// })