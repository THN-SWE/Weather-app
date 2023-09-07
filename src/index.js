import './styles/style.css';


let saved_cities_container = document.getElementById('saved-cities')
// const  weather_out = document.getElementById('weather-out')
let temperature_container = document.getElementById('temp')
let weather_dec_container = document.getElementById('desc')
let city_container = document.getElementById('city')
let input_loc = document.getElementById('city-inp')
let curr_loc = ''
const API_key = 'bdebfbd56aa02bc66c48751fd367cc66'
// this is a query selector. let you select element by css selectors
let search_btn = document.querySelector('#enter-btn');

let saved_cities = {};

// renderSavedCityLabels()
async function getWeather() {

    // fetching data from open weather api
    const fetch_weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input_loc.value}&appid=${API_key}`)
    const weather_data = fetch_weather.json()
    weather_data.then(data => {
        // Check if the response contains valid data
        try {
            if (data.cod === 200) {
                const temperature = (data.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius
                const description = data.weather[0].description;

                temperature_container.textContent = temperature + '°C.'
                weather_dec_container.textContent = description
                city_container.textContent = input_loc.value
                CreateSavedCityLabel(input_loc.value)
                saved_cities = getCitiesFromLocalStorage()
                saved_cities[input_loc.value] = input_loc.value
                setCitiesToLocalStorage()

                clearInput()

            } else {
                alert('City not found. Please try again.')
            }
        }
        catch {
            console.error('Error fetching weather data:');
            alert('fetching weather data')

        }
        finally {
            search_btn.disabled = false
        }
    })

}
const returnSavedHtml = (city) => {
    const saved_div = document.createElement('div')
    const span = document.createElement('span')

    saved_div.classList.add('saved')
    saved_div.setAttribute('id', city)
    span.textContent = city
    saved_div.appendChild(span)

    saved_div.onclick = () => {

        input_loc.value = saved_div.id
        console.log(saved_div.id)
        saved_div.outerHTML = ''
        delete saved_cities[saved_div.id]

        setCitiesToLocalStorage()
    }
    return saved_div
}
function CreateSavedCityLabel(city) {
    if (city != '') {
        saved_cities_container.appendChild(returnSavedHtml(city));
    }

}
function clearInput() {
    input_loc.value = ''
}

async function main() {
    // retrieve saved cities from local storage
    for (let lable in getCitiesFromLocalStorage()) {
        CreateSavedCityLabel(lable)
    }
    search_btn.addEventListener('click', async () => {
        curr_loc = input_loc.value
        search_btn.disabled = true
        await getWeather()
    })
}
function setCitiesToLocalStorage() {
    let saved_string = JSON.stringify(saved_cities);
    localStorage.setItem('saved_cities', saved_string);
}
function getCitiesFromLocalStorage() {
    try {
        saved_cities = JSON.parse(localStorage.getItem('saved_cities')) || {};
        return saved_cities;
    } catch {
        console.error('Error retrieving data from Local Storage');

    }
}

main()

