import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key ahora tiene el valor configurado

const baseUrl = "https://api.openweathermap.org/data/2.5/"

export const getWeatherByLatLng = (lat,lng) => {
    const request = axios.get(`${baseUrl}weather?lat=${lat}&lon=${lng}&appid=${api_key}`)
    return request.then(response=> response.data)

}