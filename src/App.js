import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import React, { useState, useEffect, useRef } from 'react';

const axios = require('axios').default;


function App() {
  const [unitOfMeasurment, setUnitOfMeasurement] = useState("imperial");
  const [defaultCity, setDefaultCity] = useState(`austin`)
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [temp, setTemp] = useState(null);
  const [changeCity, setChangeCity] = useState('');

  const [forecast, setForecast] = useState(null);
  const [forecastTemps, setForecastTemps] = useState([])

  const handleChange = event => {
    setChangeCity(event.target.value);

    console.log('value is:', event.target.value);
  };

  const inputRef = useRef(null);

  function handleClick() {
    setDefaultCity(inputRef.current.value);
    setChangeCity('');
  }

  useEffect(() => {
    console.log("use effect fired");
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=89d53e26dcb182abf23165adbc6cc1e9&units=${unitOfMeasurment}`)
      .then(function (response) {
        // handle success
        console.log(response.data)
        setCity(response.data.name);
        setTemp(Math.floor(response.data.main.temp));
        setWeatherIcon(`http://openweathermap.org/img/w/` + response.data.weather[0].icon + `.png`);
        setWeather(response.data.weather[0].main);
      });
    axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${defaultCity}&cnt=7&appid=89d53e26dcb182abf23165adbc6cc1e9&units=${unitOfMeasurment}`)
      .then(function (response) {
        // handle success
        setForecast(response.data.list);

      });

  }, [defaultCity]);

  useEffect(() => {
    if (forecast) {
      let newArray = [];
      for (let i = 0; i <= 6; i++) {
        console.log(forecast[i])
        newArray.push(forecast[i]);
        setForecastTemps(newArray)
      }
    }

  }, [forecast]);

  return (
    <div className="App">
      <header className="App-header">

        <Row>
          <img className="weatherIcon" alt={weather} src={weatherIcon}></img>
          <h1>{city}</h1>
          <h2>{weather} / {temp}&#x2109;</h2>
        </Row>

        <Container className='searchBox'>
          <Row>
            <input type="text" id="cityName"
              ref={inputRef}
              name="cityName"
              onChange={handleChange}
              value={changeCity}>
            </input>

            <Button variant="outline-primary" className='searchButton' onClick={handleClick}>
              Change City
            </Button>
          </Row>
          <Row>
            {forecastTemps.slice(0, 5).map((temperature) => {
              let epochToDate = parseInt(temperature.dt);
              console.log(epochToDate);
              let date = new Date(epochToDate * 1000).toDateString();
              return (
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={`http://openweathermap.org/img/w/${temperature.weather[0].icon}.png`} />
                  <Card.Body>
                    <Card.Title>{date.toString()}</Card.Title>
                    <Card.Text>
                      <b>Day</b>: {Math.floor(temperature.temp.day)}&#x2109;
                    </Card.Text>
                    <Card.Text>
                      <b>High</b>: {Math.floor(temperature.temp.max)}&#x2109;
                    </Card.Text>
                    <Card.Text>
                      <b>Low</b>: {Math.floor(temperature.temp.min)}&#x2109;
                    </Card.Text>
                  </Card.Body>
                </Card>
              )
            }
            )}

          </Row>
        </Container>
      </header>
    </div >
  );
}

export default App;
