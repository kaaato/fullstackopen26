import { useState } from "react"
import Info from './Info'
import weatherServices from '../services/weather'

const CountryName = ({ country, countryRef, weatherData, setWeatherData }) => {
  const [moreInfo, setMoreInfo] = useState(null)

  const showMoreInfo= () => {
    setMoreInfo(!moreInfo)
    if (countryRef.current === country.name) return

    weatherServices
      .getCurrentWeather(country.latlng[0], country.latlng[1])
      .then(info => {
        setWeatherData(info)
        countryRef.current = country.name
      })
  }

  if (moreInfo) {
    return (
      <li>
        <button onClick={() => setMoreInfo(!moreInfo)}>Close</button>
        <Info country={country} weatherData={weatherData}/>
      </li>
    )
  }

  return (
    <li>
      <span>{country.name}</span>
      <button onClick={showMoreInfo}>Show</button>
    </li>
  )
}

export default CountryName