
const express = require('express')
const cors = require('cors') //Cross-Origin Resource Sharing (CORS)
const app = express()

//request body validation middleware
const BodyParser = require('body-parser');
const { celebrate, Joi, errors, Segments } = require('celebrate');

//DB setup
const TripDB = require("./modules/tripDB.js");
const db = new TripDB();
exports.db = db;

//setup dotenv
const dotenv = require('dotenv')
require('dotenv').config()

//environment variables and port
const { CONNECT_STRING } = process.env
const HTTP_PORT = process.env.PORT || 8080

//setup middleware
app.use(cors());
app.use(express.json())
app.use(BodyParser.json());

//import route Controllers
const tripControllers = require('./controllers/trip-controller')

const postHandler = celebrate({

    [Segments.BODY]: Joi.object().keys({
        tripduration: Joi.number().integer(),
        ['start station id']: Joi.number().required(),
        ['start station name']: Joi.string().required(),
        ['end station id']: Joi.number(),
        ['end station name']: Joi.string(),
        bikeid: Joi.number(),
        usertype: Joi.string(),
        ['birth year']: Joi.number(),
        gender: Joi.number(),
        ['start station location']: {
            type: { type: Joi.string() },
            coordinates: [Joi.number()]
        },
        ['end station location']: {
            type: { type: Joi.string() },
            coordinates: [Joi.number()]
        }
    })
})


//ROUTING
app.get('/', tripControllers.rootDir)

// add new trip
app.post("/api/trips", postHandler, tripControllers.postNewTrip)

// find and sort trips
app.get('/api/trips', tripControllers.retrieveAllTrips)

// find trip by id
app.get('/api/trips/:id', tripControllers.retrieveTripById)

//update a trip by input body
app.put('/api/trips/:id', tripControllers.renewTripById)

//delete a trip
app.delete('/api/trips/:id', tripControllers.removeTrip)

db.initialize(CONNECT_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.log(err)
    })