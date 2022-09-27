//DB setup
const { db } = require("../server")

//GET: '/'
const rootDir = (req, res) => {
    res.json({ message: "API Listening, Really?" })
}
exports.rootDir = rootDir;



//POST "/api/trips"
const postNewTrip = (req, res) => {
    const data = req.body

    newTrip = db.addNewTrip(new_trip)
        .then(newTrip => {
            res.json({ message: `Trip with id: ${newTrip} created.` })
        })
}
exports.postNewTrip = postNewTrip;



//GET: '/api/trips'
const retrieveAllTrips = (req, res, next) => {
    const page = req.query.page         // page No.
    const perPage = req.query.perPage   // No of data set in a single page

    db.getAllTrips(page, perPage).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(404).json({ message: "data not found" })
    })
}
exports.retrieveAllTrips = retrieveAllTrips;



//GET: '/api/trips/:id'
const retrieveTripById = (req, res, next) => {

    db.getTripById(req.params.id)
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.status(404).json({ message: "data for the ID not found" })
        })
}
exports.retrieveTripById = retrieveTripById;



//PUT: '/api/trips/:id'
const renewTripById = (res, req, next) => {
    const id = req.params.id;
    const trip = req.body

    db.updateTripById(trip, id)
        .then(result => {
            res.json({ message: `Trip of id: ${id} updated.` })
        })
        .catch(err => {
            res.json({ message: err })
        })
}
exports.renewTripById = renewTripById;



//DELETE: '/api/trips/:id'
const removeTrip = (res, req, next) => {
    const id_removed = req.params.id

    db.deleteTripById(id_removed)
        .then(result => {
            res.json({ message: `Trip of id: ${id_removed} removed.` })
        })
        .catch(err => {
            res.status(404).json({ message: `Trip of id: ${id_removed} cannot be found` })
        })
}
exports.removeTrip = removeTrip;