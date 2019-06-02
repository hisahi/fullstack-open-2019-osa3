
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const contactScheme = new mongoose.Schema({
    name: String,
    number: String
})
const Contact = mongoose.model('Contact', contactScheme)

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0-0szob.mongodb.net/contacts?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

if (process.argv.length < 5) {
    Contact.find({}).then(result => {
        console.log("puhelinluettelo:")
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })

} else {
    const name = process.argv[3];
    const number = process.argv[4];

    const contact = new Contact({name: name, number: number})
    console.log(`lisätään ${name} numero ${number} luetteloon`)

    contact.save().then(result => {
        mongoose.connection.close()
    })
}
