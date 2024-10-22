import { useState, useEffect } from "react";
import { getCountryByName } from "../services/countriesService";
import { getWeatherByLatLng } from "../services/weatherService";

export const ListCoutries = ({countries, handleFilterChange}) => {

    const [countryDetails, setCountryDetails] = useState(null);
    const [weather, setWeather] = useState(null)
  
    useEffect(() => {
      if (countries.length === 1) {
        const country = countries[0];
         getCountryByName(country.name.common)
          .then(response => {
            setCountryDetails(response);
          })
          .catch(err => console.log(err));
          
          getWeatherByLatLng(country.latlng[0],country.latlng[1])
          .then(response => {
            setWeather(response);
          })
          .catch(err => console.log(err));
      }
    }, [countries]);
  
  
    if(countries.length >10) return 'Too many matches, specify another filter'
  
    if(countries.length == 1 && countryDetails && weather){
     return (
        <div>
          <h1>{countryDetails.name.common}</h1>
          <p>capital {countryDetails.capital}
            <br />
            area {countryDetails.area}
          </p>
  
          <h3>languages:</h3>
          <ul>
            {Object.entries(countryDetails.languages).map( ([code, lang])=>(
              <li key={code}>{lang}</li>
            ))}
          </ul>
          <img alt={countryDetails.flags.alt} src={countryDetails.flags.png} style={{ width: '150px', height: 'auto' }} ></img>
          <h2>Weather in {countryDetails.name.common}</h2>
          <p>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
          <img  alt={`Weather icon for ${weather.weather[0].description}`} src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/> 
          <p>wind {(weather.wind.speed).toFixed(2)} m/s</p>
  
        </div>
      )
  
    }else{
    return (
      <div>
        {countries.map(country => <p key={country.name.common}>{country.name.common} <button value={country.name.common} onClick={handleFilterChange}>show</button></p> )}
      </div>
    )
  }
  }
  