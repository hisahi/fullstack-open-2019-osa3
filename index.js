
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('postjson', req => {
    if (req.method == "POST") {
        return JSON.stringify(req.body, null, 0)
    }
    return ""
})

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :postjson'))

let data = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "045-1236543"
    },
    {
        id: 2,
        name: "Arto Järvinen",
        number: "041-21423123"
    },
    {
        id: 3,
        name: "Lea Kutvonen",
        number: "040-4323234"
    },
    {
        id:4,
        name: "Martti Tienari",
        number: "09-784232"
    }
]


app.get('/', (req, res) => {
    res.status(403).end()
})
  
app.get('/api/persons', (req, res) => {
    res.json(data)
})
  
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = data.find(contact => contact.id === id)

    if (contact) {
        res.json(contact)
    } else {
        res.status(404).json({error: 'no such person'})
    }
})
  
app.post('/api/persons', (req, res) => {
    const contact = {...req.body}
    if (!contact.name || !contact.number) {
        return res.status(400).json({error: 'name or number missing'})
    }

    if (data.find(c => c.name === contact.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    let id = 1

    while (data.find(c => c.id === id)) {
        id = 0 | (Math.random() * (1 << 30));
    }
    contact.id = id

    data = data.concat(contact)

    res.json(contact)
})
  
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(contact => contact.id !== id)
    
    res.status(204).end()
})
  
app.get('/info', (req, res) => {
    res.send(`Puhelinluettelossa ${data.length} henkilön tiedot
    
${new Date().toString()}`)
})
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
