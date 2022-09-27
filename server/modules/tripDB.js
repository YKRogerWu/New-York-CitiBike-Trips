const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    "tripduration": Number,
    "start station id": Number,
    "start station name": String,
    "end station id": Number,
    "end station name": String,
    "bikeid": Number,
    "usertype": String,
    "birth year": Number,
    "gender": Number,
    "start station location": {
        "type": { type: String },
        "coordinates": [Number]
    },
    "end station location": {
        "type": { type: String },
        "coordinates": [Number]
    },
    "start time": Date,
    "stop time": Date
});

module.exports = class TripDB {
    constructor() {
        // We don't have a `Trip` object until initialize() is complete
        this.Trip = null;
    }

    // Pass the connection string to `initialize()`
    initialize(connectionString) {
        return new Promise((resolve, reject) => {
            const db = mongoose.createConnection(
                connectionString
            );

            db.once('error', (err) => {
                console.log("db fail to connect.")
                reject(err);
            });
            db.once('open', () => {
                this.Trip = db.model("trips", tripSchema);                
                resolve();
            });
        });
    }

    //Create a new trip in the collection using the object passed in the "data" parameter
    async addNewTrip(data) {
        const newTrip = new this.Trip(data);
        await newTrip.save();
        return newTrip;
    }

    //Return an array of all trips for a specific page (sorted by _id), given the number of items per page.
    getAllTrips(page, perPage) {
        if (+page && +perPage) {
            return this.Trip.find().sort({ _id: +1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
            }

        return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
    }

    getTripById(id) {
        
        return this.Trip.findOne({ _id: id }).exec();
    }

    updateTripById(data, id) {
        return this.Trip.updateOne({ _id: id }, { $set: data }).exec();
    }

    deleteTripById(id) {
        return this.Trip.deleteOne({ _id: id }).exec();
    }
}