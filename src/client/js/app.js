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

const getImageData = async (pixabayUrl, pixabayKey, newCity) => {
    try {
        const res = await fetch (pixabayUrl + pixabayKey + '&q=' + newCity + '+&image_type=illustration');
        const imageData = await res.json();
        return imageData;
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

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

//Function called by event listener
function performAction(e) {
    let newCity = document.getElementById('city').value;
    const imageData = getImageData(pixabayUrl, pixabayKey, newCity);
    const cityData = getCityData(geonamesUrl, geonamesUrlTwo, newCity, geonamesKey);
    return cityData
    .then((cityData) => {
        let latitude = cityData.geonames[0].lat;
        let longitude = cityData.geonames[0].lng;
        let newDate = document.getElementById('date').value;
        const weatherData = getWeatherData(latitude, longitude, newDate);
        return weatherData
    })
    .then((weatherData) => {
        const tempCelsius = Math.round((weatherData.data[0].temp -32) *5/9);
        const allData = postData('/add', {newCity, newDate, image : imageData, temperature: tempCelsius, weather: weatherData.data[0].weather.description});
        return allData;
    })
    .then((allData) => {
        updateUI(allData);
    })
};

//Update UI
const updateUI = async (allData) => {
    try {
        const res = await fetch('/all');
        const allData = await res.json();
        let cityImage = imageData;
        //Fix date
        let d = new Date();
        let newDate = d.getMonth()+ 1 +'.'+ d.getDate()+'.'+ d.getFullYear();
        const daysLeft = Math.ceil((newDate - currentDate) / (3600 * 1000 * 24));
        //
        document.getElementById('city-image').setAttribute('src', cityImage);
        document.getElementById('holder-entry').innerHTML = `Your trip to ${allData.newCity} is within ${daysLeft} days, and the weather will be ${allData.temperature} degrees and ${allData.weather}`;
    } catch(error) {
        console.log("error", error);
    };
};

export {performAction}