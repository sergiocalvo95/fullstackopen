import axios from 'axios'


const baseUrl = "http://localhost:3001/persons"

export const getAll = () =>{
    const request = axios.get(baseUrl)
    return request.then(response=> response.data)
    
}

export const addPerson = (person) => {

    const request = axios.post(baseUrl,person)
    return request.then(response =>response.data)

}

export const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export const updatePerson = (person) => {
    const request = axios.put(`${baseUrl}/${person.id}`, person)
    return request.then(response => response.data)
}