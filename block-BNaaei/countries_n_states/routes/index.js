var express = require('express');
const { STATES } = require('mongoose');
var router = express.Router();
var Country = require("../models/Country");
var State = require("../models/State");
var mongoose = require("mongoose");

// get all countries
router.get('/country', (req, res, next) => {
    Country.find({}, (err, country) => {
        if (err) return next(err);
        return res.status(200).json({ country });
    });
});

// creating a country 
router.post('/country', (req, res, next) => {
    Country.create(req.body, (err, country) => {
        if (err) return next(err);
        return res.status(200).json({ country });
    });
});

// countries in ascending order
router.get('/country/ascending', (req, res, next) => {
    Country.aggregate([{ $sort: { name: 1 } }], (err, countries) => {
        if (err) return next(err);
        return res.status(200).json({ countries });
    })
});

// countries in descending order
router.get('/country/descending', (req, res, next) => {
    Country.aggregate([{ $sort: { name: -1 } }], (err, countries) => {
        if (err) return next(err);
        return res.status(200).json({ countries });
    });
});

// update a country 
router.put("/country/:country_id", (req, res, next) => {
    let country_id = req.params.country_id;
    Country.findByIdAndUpdate(country_id, req.body, (err, updatedCountry) => {
        if (err) return next(err);
        return res.status(200).json({ updatedCountry });
    });
});

// delete a country
router.delete("/country/:country_id/delete", (req, res, next) => {
    let country_id = req.params.country_id;
    Country.findByIdAndDelete(country_id, (err, deletedCountry) => {
        if (err) return next(err);
        State.deleteMany(deletedCountry.states, (err, deletedStates) => {
            if (err) return next(err);
            return res.status(200).json({ deletedCountry, deletedStates });
        })
    });
});

//creating states and adding it to country
router.put("/state/:country_id", (req, res, next) => {
    let country_id = req.params.country_id;
    req.body.country = country_id;
    State.create(req.body, (err, state) => {
        if (err) return next(err);
        Country.findByIdAndUpdate(country_id, { $push: { states: state } }, (err, updatedCountry) => {
            if (err) return next(err);
            return res.status(200).json({ updatedCountry });
        });
    });
});

// update a state
router.put("/state/:state_id/edit", (req, res, next) => {
    let state_id = req.params.state_id;
    State.findByIdAndUpdate(state_id, req.body, (err, updatedState) => {
        if (err) return next(err);
        return res.status(200).json({ updatedState });
    });
});

// delete a state
router.delete("/state/:state_id/delete", (req, res, next) => {
    let state_id = req.params.state_id;
    State.findByIdAndDelete(state_id, (err, deletedState) => {
        if (err) return next(err);
        Country.findByIdAndUpdate(deletedState.country, { $pull: { states: state_id } }, (err, updatedCountry) => {
            if (err) return next(err);
            return res.status(200).json({ deletedState, updatedCountry });
        })
    })
})

// list all states for a country in ascending order
router.get("/state/:country_id/ascending", (req, res, next) => {
    let country_id = req.params.country_id;
    State.aggregate([{ $match: { country: mongoose.Types.ObjectId(country_id) } }, { $sort: { name: 1 } }], (err, states_ascending) => {
        if (err) return next(err);
        return res.status(200).json({ states_ascending });
    });

});

// list all states for a country in descending order
router.get("/state/:country_id/descending", (req, res, next) => {
    let country_id = req.params.country_id;
    State.aggregate([{ $match: { country: mongoose.Types.ObjectId(country_id) } }, { $sort: { name: -1 } }], (err, states_descending) => {
        if (err) return next(err);
        return res.status(200).json({ states_descending });
    });
});

// list all states in an ascending order of their population
router.get("/state/ascending_population", (req, res, next) => {
    State.aggregate([{ $sort: { population: 1 } }], (err, states_ascending_acc_population) => {
        if (err) return next(err);
        return res.status(200).json({ states_ascending_acc_population });
    })
});

// list all states in an descending order of their population
router.get("/state/descending_population", (req, res, next) => {
    State.aggregate([{ $sort: { population: -1 } }], (err, states_descending_acc_population) => {
        if (err) return next(err);
        return res.status(200).json({ states_descending_acc_population });
    })
});


// for a particular state, list all neighbouring states
router.get("/state/:state_id/neighbours", (req, res, next) => {
    let state_id = req.params.state_id;
    State.findById(state_id).populate('neighbouring_states').exec((err, states) => {
        if (err) return next(err);
        let neighbours = states.neighbouring_states;
        return res.status(200).json({ neighbours });
    });
});

// for a particular country, list all neighbouring countires
router.get("/country/:country_id/neighbours", (req, res, next) => {
    let country_id = req.params.country_id;
    Country.findById(country_id).populate('neighbouring_countries').exec((err, countries) => {
        if (err) return next(err);
        let neighbours = countries.neighbouring_countries;
        return res.status(200).json({ neighbours });
    });
});

// list all religions present in entire country dataset.
router.get('/country/ethnicity', (req, res, next) => {
    Country.distinct('ethnicity', (err, allReligions) => {
        if (err) return next(err);
        return res.status(200).json({ allReligions });
    });
});

// list countries based on religions.
router.get("/country/acc_to_religions", (req, res, next) => {
    Country.aggregate([{ $unwind: "$ethnicity" }, { $group: { _id: "$ethnicity", namesArr: { $push: "$name" } } }], (err, countries) => {
        if (err) return next(err);
        return res.status(200).json({ countries });
    });
});

// list countries based on continent.
router.get("/country/acc_to_continent", (req, res, next) => {
    Country.aggregate([{ $group: { _id: "$continent", count: { $sum: 1 } } }], (err, countries) => {
        if (err) return next(err);
        return res.status(200).json({ countries });
    });
});

// list countries based on population.
router.get("/country/acc_to_population", (req, res, next) => {
    Country.aggregate([{ $group: { _id: "$population", count: { $sum: 1 } } }], (err, countries) => {
        if (err) return next(err);
        return res.status(200).json({ countries });
    });
});


module.exports = router;