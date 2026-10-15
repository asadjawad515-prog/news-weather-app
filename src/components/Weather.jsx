import { useState } from 'react'

function Weather() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('metric')
  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.')
      setWeather(null)
      return
    }

    setError('')
    setLoading(true)
    try {

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
      )

      const data = await response.json()

      if (!response.ok) {
        setError('City not found. Please enter a valid city.')
        setWeather(null)
        setLoading(false)
        return
      }

      setError('')
      setWeather(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError('Weather could not be loaded. Please check your internet connection.')
      setWeather(null)
      setLoading(false)
    }
  }
  return (
    <div className="weather-section">
      <h2>Weather</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={() => searchWeather()}>Search</button>
      <div className="unit-switch">
        <button
          className={unit === 'metric' ? 'active' : ''}
          onClick={() => setUnit('metric')}
        >
          °C
        </button>

        <button
          className={unit === 'imperial' ? 'active' : ''}
          onClick={() => setUnit('imperial')}
        >
          °F
        </button>
      </div>
      {loading && <p>Loading weather...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div className="weather-result">
          <h3>{weather.name}</h3>
          <p>
            Temperature: {
  unit === 'metric'
    ? weather.main.temp
    : (weather.main.temp * 9 / 5 + 32).toFixed(1)
}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>
            Wind: {
  unit === 'metric'
    ? weather.wind.speed
    : (weather.wind.speed * 2.23694).toFixed(1)
} {unit === 'metric' ? 'm/s' : 'mph'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Weather