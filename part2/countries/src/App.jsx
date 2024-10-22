import { useEffect } from 'react'
import './index.css'
import { useState } from 'react'
import { getAll } from './services/countriesService'
import { ListCoutries } from './components/ListCountries'
import { Find } from './components/Find'


function App() {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')



  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
  }

  useEffect(() =>{
    getAll().then( response =>
      setCountries(response)
    )
  }, [])


  const countriesToShow = newFilter ? countries.filter(country=> country.name.common.toLowerCase().includes(newFilter.toLowerCase())) : countries 

  return (
    <div>
      <Find newFilter={newFilter} handleFilterChange={handleFilterChange}></Find>
      <ListCoutries countries={countriesToShow} handleFilterChange={handleFilterChange} newFilter={newFilter}></ListCoutries>
    </div>

  )
}

export default App
