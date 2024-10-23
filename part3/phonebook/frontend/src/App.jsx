import { useEffect, useState } from 'react'
import { addPerson, deletePerson, getAll, updatePerson } from './services/phonebookService'
import './index.css'



const Notification = ({ message }) => {


  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}



const Error = ({ message }) => {


  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Filter = (props) =>{
  const {newFilter, handleFilterChange} = props

  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleFilterChange}></input>
    </div>
  )
}

const Persons = (props) =>{
  const {persons, deletePersonById} = props
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map(person => 
      <p key={person.id} >{person.name} {person.number} <button onClick={() => deletePersonById(person.id)}>delete</button></p>
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
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newNotification, setNewNotification] = useState(null)
  const [newError, setNewError] = useState(null)


  useEffect(() => {
    getAll().then( response =>
      setPersons(response)
    )
  },[])

  // useEffect(() => {
  //   fetch("http://localhost:3001/persons")
  //   .then((response) => response.json())
  //   .then((json) =>{
  //     setPersons(json)
  //   }).catch(error => console.log(error))
  // },[])




  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)

  }

  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
  }

  const deletePersonById = (id) =>{
    const personToDelete = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${personToDelete.name}`)){
    deletePerson(id).then(() => {
      setPersons(persons.filter(person => person.id !==id))
      setNewNotification(`Deleted`)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)
    }).catch(() =>{
      setNewError(`${id} can't been deleted`)
      setTimeout(() => {
        setNewError(null)
      }, 5000)
    })
  }
  }

  const addName = (event) =>{
    event.preventDefault()
    const newPerson = 
    { name: newName,
      number: newNumber,
      id: persons.length+1+""
     }

    const existingPerson = persons.find(person=>person.name.toLowerCase() === newPerson.name.toLowerCase())
    if(existingPerson){
      if(window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)){
        updatePerson({...existingPerson, number: newPerson.number})
        .then( response =>{
          setPersons(persons.map( person => person.id === response.id ? response : person))
          setNewName('')
          setNewNumber('')
          setNewNotification(`Updated ${response.name}`)
          setTimeout(() => {
            setNewNotification(null)
          }, 5000)
      }).catch(() =>{
        setNewError(`Information of ${newPerson.name} has already been removed from server`)
        setTimeout(() => {
          setNewError(null)
        }, 5000)
      })
      }
      
    }else{
      addPerson(newPerson).then(response =>{ 
        setPersons([...persons, response])
        setNewName('')
        setNewNumber('')
        setNewNotification(`Added ${response.name}`)
        setTimeout(() => {
          setNewNotification(null)
        }, 5000)
      })
    .catch(() =>{
      setNewError(`${newPerson.name} can't been added`)
      setTimeout(() => {
        setNewError(null)
      }, 5000)
    })

    }
  }

  const personsToShow = newFilter ? persons.filter(person=> person.name.toLowerCase().includes(newFilter.toLowerCase()) || person.number.includes(newFilter)) : persons 

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={newError}></Error>
      <Notification message={newNotification}></Notification>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}></Filter>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <Persons deletePersonById = {deletePersonById} persons = {personsToShow}></Persons>
    </div>
  )
}

export default App