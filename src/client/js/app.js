// Geonames API
const geonamesUrl = 'http://api.geonames.org/searchJSON?q=';
const geonamesUrlTwo = '&maxRows=1&username=';
const geonamesKey = 'jogaraba';

// Weatherbit API
const weatherbitUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitKey = 'f2c0becdfbbc4697987d77c9278d4151';

// Pixabay API
const pixabayUrl = 'https://pixabay.com/api/?key=';
const pixabayKey = '21600245-8c008566b7aa3e4a91c9543ab';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+ 1 +'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

//Function called by event listener
function performAction(e) {
    let newCity = document.getElementById('city').value;
    let newDate = document.getElementById('date').value;
    getCityData (geonamesUrl, geonamesUrlTwo, newCity, geonamesKey)
    .then((data) => {
        let latitude = data.geonames[0].lat;
        let longitude = data.geonames[0].lng;
        const weatherData = getWeatherData(latitude, longitude, newDate);
        return weatherData;
    })
    .then((weatherData) => {
        const tempCelsius = Math.round((weatherData.data[0].temp -32) *5/9);
        const allData = postData('/add', {newCity, newDate, temperature: tempCelsius, weather: weatherData.data[0].weather.description});
        return allData;
    })
    .then((allData) => {
        updateUI(allData);
    })
}

// Functions to GET Web API Data
const getCityData = async (geonamesUrl, geonamesUrlTwo, newCity, geonamesKey) => {
    try {
        const res = await fetch (geonamesUrl + newCity + geonamesUrlTwo + geonamesKey);
        const cityData = await res.json();
        return cityData;
    } catch(error) {
        console.log("error", error);
    };
};

const getWeatherData = async (latitude, longitude, newDate) => {
    try {
        const res = await fetch (weatherbitUrl + '&lat=' + latitude + '&lon=' + longitude + '&start_date=' + newDate + '&end_date=' + newDate + '&units=I'+'&key=' + weatherbitKey);
        const weatherData = await res.json();
        return weatherData;
    } catch(error) {
        console.log("error", error);
    };
};

//Function to POST Web API Data
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch (url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const newData = await response.json();
        return newData;
    } catch(error) {
        console.log("error", error);
    };
};