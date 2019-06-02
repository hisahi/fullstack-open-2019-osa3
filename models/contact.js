
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    }
})
contactSchema.plugin(uniqueValidator)
const Contact = mongoose.model("Contact", contactSchema)

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.log("specify MONGODB_URI in env")
    process.exit(1)
}

contactSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("could not connect to MongoDB")
        process.exit(1)
    })

module.exports = Contact
