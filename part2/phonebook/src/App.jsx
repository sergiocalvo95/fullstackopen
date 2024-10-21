import { useState } from 'react'

const Filter = (props) =>{
  const {newFilter, handleFilterChange} = props

  return (
    <div>
      <h2>Phonebook</h2>
      filter shown with <input value={newFilter} onChange={handleFilterChange}></input>
    </div>
  )
}

const Persons = (props) =>{
  const {persons} = props
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map(person => 
      <p key={person.id} >{person.name} {person.number}</p>
      )}
    </div>
  )
}

const PersonForm = (props) => {
  const {addName, newName,newNumber, handleNameChange, handleNumberChange} = props
  return (
    <div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
              <div>
                name: <input value={newName} onChange={handleNameChange} required/>
              </div>
              <div>
                number: <input value={newNumber} onChange={handleNumberChange} required/>
              </div>
              <div>
                <button type="submit" >add</button>
              </div>
            </form>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)

  }

  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
  }

  const addName = (event) =>{
    event.preventDefault()
    const newPerson = 
    { name: newName,
      number: newNumber,
      id: persons.length+1
     }
    if(persons.some(person=>person.name.toLowerCase() === newPerson.name.toLowerCase())){
      alert(`${newPerson.name} is already added to phonebook`)
    }else{
      setPersons([...persons, newPerson])
      setNewName('')
      setNewNumber('')
    }
  }

  const personsToShow = newFilter ? persons.filter(person=> person.name.toLowerCase().includes(newFilter.toLowerCase())) : persons

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}></Filter>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <Persons persons = {personsToShow}></Persons>
    </div>
  )
}

export default App