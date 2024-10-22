import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

export const getAll = ()=> {
    const request = axios.get(`${baseUrl}/api/all`)
    return request.then(response => response.data)
} 


export const getCountryByName = (name) =>{
    const request = axios.get(`${baseUrl}/api/name/${name}`)
    return request.then(response => response.data)
}