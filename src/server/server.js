// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8080;
const server = app.listen(port, () => {
    console.log(`Server is running on localhost: ${port}`);
});

// GET route
app.get('/all', function (req, res) {
    res.send(projectData);
});

// POST route
app.post('/add', function (req, res) {
    let data = req.body;
    projectData["newCity"] = data.newCity;
    projectData["newDate"] = data.newDate;
    projectData["temperature"] = data.temperature;
    projectData["weather"] = data.weather;
    projectData["image"] = data.image;
    res.send(projectData);
});