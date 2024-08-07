// Dotenv
require('dotenv').config()
// Bring in Express
const express = require('express');
// mongoose
const mongoose = require('mongoose');
// set a variable of app to run the express method
const app = express();
// set a port - listen changes on the port
const port = 4000;

// Import routes
const workoutRoutes = require('./routes/workouts')

// use json with express
app.use(express.json());

// log out the path and method of each request:
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Attach the routes to the app
app.use('/api/workouts', workoutRoutes)

const mongoUsername = process.env.MONGODB_USERNAME
const mongoPassword = process.env.MONGODB_PASSWORD

const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.zbhunml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Define the home route for the backend (url address)
app.get('/', (req, res) => {
    // What happens at that route
    res.send("Hello, this is your express server!")
})

// Listen to changes
app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
});

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB Atlas:');
    });