import CountryName from './CountryName'
import Info from './Info'

const Countries = ({ countriesToShow, weatherData, setWeatherData, countryRef }) => {
  if (!countriesToShow) {
    return null
  } else if (countriesToShow.length >= 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (2 <= countriesToShow.length && countriesToShow.length <= 9) {
    return (
      <ul className='countries'>
        {
          countriesToShow.map(country =>
            <CountryName 
              key={country.name}
              country={country}
              countryRef={countryRef}
              weatherData={weatherData}
              setWeatherData={setWeatherData}
            />
          )
        }
      </ul>
    )

  } else if (countriesToShow.length === 1) {
    return (
      <Info
        country={countriesToShow[0]}
        weatherData={weatherData}
      />
    )
  }

}

export default Countries