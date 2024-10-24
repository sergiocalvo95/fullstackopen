require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''; // Solo incluir el cuerpo en POST
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



app.get('/', (request,response) => {
    response.status(200).send('<h1>server working</h1>')
})

app.get('/api/persons', (request,response) => {
  // response.status(200).send(persons)
  console.log("llamada")
  Person.find({}).then(persons => {
      response.status(200).json(persons)
    })
  })


  app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
      response.status(200).send(
        `Phonebook has info for ${count} people <br/><br/>
        ${new Date()}`
      )
    })
  })

app.get('/api/persons/:id', (request, response )=>{
  const id = request.params.id
  // const person = persons.find(person => person.id===id)
  // response.status(302).send(person)
  Person.findById(id).then(person => {
    response.status(200).json(person)
  })
})

app.delete('/api/persons/:id', (request, response )=>{
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result =>{
      if(result) response.status(204).end() 
      else response.status(404).send({ error: 'Person not found' })
    })
  })


  app.post('/api/persons/', (request, response ) =>{
    const body = request.body

    if(!body.name || !body.number){
      response.status(400).send({ error: 'Name or number is missing' })
    }

    Person.findOne({ name: body.name })
      .then(existingPerson => {
        if(existingPerson){
          response.status(409).send({ error: 'Name must be unique' })
        } else {
          const newPerson = new Person(
            {
              name: body.name,
              number: body.number
            })

          newPerson.save().then(savedPerson => {
            response.status(201).json(savedPerson)
          })
        }
      })
  })

  app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    Person.findByIdAndUpdate(
      id, 
      { name: body.name, number: body.number }, 
      { new: true, runValidators: true}
    ).then(updatedPerson => {
        if (updatedPerson) {
          response.status(200).json(updatedPerson)
        } else {
          response.status(404).send({ error: 'Person not found' })
        }
      })

  })

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
