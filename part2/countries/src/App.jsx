import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import weatherServices from './services/weather'

const App = () => {
  const [value, setValue] = useState('')
  const [allCountries, setAllCountries] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const countryRef = useRef(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data.map(obj => {
          return {
            name: obj.name.common,
            capital: obj.capital,
            area: obj.area,
            languages: obj.languages,
            flags: obj.flags,
            latlng: obj.latlng,
          }
        }))
      })

  }, [])

  
  useEffect(() => {
    if (!allCountries) return

    const countries = allCountries.filter(c => c.name.toUpperCase().includes(value.toUpperCase()))

    if (countries.length !== 1) return
    if (countryRef.current === countries[0].name) return

    weatherServices
      .getCurrentWeather(countries[0].latlng[0], countries[0].latlng[1])
      .then(info => {
        setWeatherData(info)
        countryRef.current = countries[0].name
      })

  }, [value, allCountries])
  
  const countriesToShow = (value)
    ? allCountries.filter(country => country.name.toUpperCase().includes(value.toUpperCase()))
    : null

  return (
    <div>
      <div>
        find countries
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <Countries
        countriesToShow={countriesToShow}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
        countryRef={countryRef}
        />
    </div>
  )
}

export default App
