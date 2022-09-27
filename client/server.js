const express = require('express');
const cors = require('cors');
const TripDB = require("./modules/tripsDB.js");
const db = new TripDB();

require('dotenv').config();
const {MONGO_URI_STRING} = process.env;

const app = express();
app.use(express.json());
app.use(cors());

const HTTP_PORT = process.env.PORT;

// ********* API Routes *********
db.initialize(MONGO_URI_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Server started on port ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
})

// HOME ROUTE
app.get('/', (req,res)=>{
    res.json({message: "API Listening!"});
})

app.post('/api/trips', (req,res)=>{
    db.addNewTrip(req.body).then((newTrip)=>{
        res.status(201).json({message: `Trip with id: ${newTrip._id} created`});
    }).catch((err)=>{
        res.status(404).json({message: err});
    })
})

app.get('/api/trips', (req,res)=>{
    db.getAllTrips(req.query.page, req.query.perPage).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.status(404).json({message: err});
    })
})

app.get('/api/trips/:_id', (req,res)=>{
    db.getTripById(req.params._id).then((data)=>{
        res.json(data);  
    }).catch((err)=>{
        res.status(404).json({message: err});
    })
})

app.put('/api/trips/:_id', (req,res)=>{
    db.updateTripById(req.body, req.params._id).then(()=>{
        res.status(201).json({message: `Successfuly updated trip ${req.params._id}`}); 
    }).catch((err)=>{
        res.status(404).json({message: err});
    })
})

app.delete('/api/trips/:_id', (req,res)=>{
    db.deleteTripById(req.params._id).then(()=>{
        res.json(`Trip ${req.params._id} deleted successfully.`); 
    }).catch((err)=>{
        res.status(404).json({message: err});
    })
})
