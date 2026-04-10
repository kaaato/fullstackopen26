const Info = ({ country, weatherData }) => {
  if (!weatherData) return
  return (
    <div>
      <h2>{country.name}</h2>

      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>

      <h3>Languages</h3>
      <ul>
        {
          Object.values(country.languages).map(language => 
            <li key={language}>{language}</li>
          )
        }
      </ul>
      <div> 
        <img src={country.flags.svg} alt={country.flags.alt} width={150} />
      </div>
      <h3>Weather in {country.capital}</h3>
      <div>Temperature {weatherData.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].description} />
      <div>Wind {weatherData.wind.speed} m/s</div>
    </div>
  )
}

export default Info