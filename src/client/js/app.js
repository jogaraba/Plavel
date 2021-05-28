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

//Function called by event listener
const performAction = async (e) => {
    let newCity = document.getElementById('city').value;
    let newDate = document.getElementById('date').value;
    let imageData = await getImageData(pixabayUrl, pixabayKey, newCity);
    getCityData(geonamesUrl, geonamesUrlTwo, newCity, geonamesKey)
        .then(async (data) => {
            let latitude = data.geonames[0].lat;
            let longitude = data.geonames[0].lng;
            if (!imageData.hits.length) {
                const countryName = data.geonames[0].countryName;
                imageData = await getImageData(pixabayUrl, pixabayKey, countryName);
            }
            const weatherData = await getWeatherData(latitude, longitude, newDate);
            return weatherData
        })
        .then(async (weatherData) => {
            const tempCelsius = Math.round((weatherData.data[0].temp -32) *5/9);
            const allData = await postData('http://localhost:8080/add', {
                newCity,
                newDate,
                image: imageData,
                temperature: tempCelsius, weather: weatherData.data[0].weather.description
            });
            return allData;
        })
        .then((allData) => {
            updateUI(allData, imageData);
        });
};

//Function to POST Web API Data
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    try {
        const newData = await response.json();
        return newData;
    } catch(error) {
        console.log('error posting data', error)
    }
};

// Event listener to add function to existing HTML DOM element
export const performA = () => { document.getElementById('submitButton').addEventListener('click', performAction)}

//Update UI
const updateUI = (allData, imageData) => {
    try {
        let cityImageURL = imageData?.hits[0]?.webformatURL;
        let tripDate = new Date(allData.newDate);
        const msLeft = tripDate.getTime() - Date.now();
        const daysLeft = Math.ceil(msLeft / 1000 / 60 / 60 / 24);
        document.getElementById('cityImage').setAttribute('src', cityImageURL);
        document.getElementById('holderEntry').innerHTML = `
            Your trip to ${allData.newCity} is within ${daysLeft} days, and the weather will be ${allData.temperature} degrees and ${allData.weather}
        `;
    } catch(error) {
        console.log("error", error);
    };
};

export {performAction}