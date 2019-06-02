
require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const Contact = require("./models/contact")

const BASE_URL = "/api/persons"

morgan.token("postjson", req => {
    if (req.method === "POST") {
        return JSON.stringify(req.body, null, 0)
    }
    return ""
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError" && error.kind === "ObjectId") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(express.static("build"))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :postjson"))

app.get("/", (req, res) => {
    res.status(403).end()
})

app.get(BASE_URL, (req, res) => {
    Contact.find({}).then(contacts =>
        res.json(contacts.map(contact => contact.toJSON()))
    )
})

app.get(BASE_URL + "/:id", (req, res, next) => {
    const id = req.params.id
    Contact.findById(id).then(contact => {
        if (contact) {
            res.json(contact)
        } else {
            res.status(404).json({ error: "no such person" })
        }
    }).catch(error => next(error))
})

app.post(BASE_URL, (req, res, next) => {
    const rawcontact = { ...req.body }

    const contact = new Contact({
        ...rawcontact
    })

    contact.save()
        .then(savedContact => savedContact.toJSON())
        .then(jsonResult => {
            res.json(jsonResult)
        }).catch(error => next(error))
})

app.put(BASE_URL + "/:id", (req, res, next) => {
    const id = req.params.id
    const rawcontact = { ...req.body }

    Contact.findByIdAndUpdate(id, rawcontact, { new: true })
        .then(contact => contact.toJSON())
        .then(jsonResult => {
            res.json(jsonResult)
        }).catch(error => next(error))
})

app.delete(BASE_URL + "/:id", (req, res, next) => {
    const id = req.params.id

    Contact.findByIdAndDelete(id).then(contact =>
        res.status(204).end()
    ).catch(error => next(error))
})

app.get("/info", (req, res) => {
    Contact.find({}).then(contacts => {
        res.send(`Puhelinluettelossa ${contacts.length} henkilön tiedot

${new Date().toString()}`)
    })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
