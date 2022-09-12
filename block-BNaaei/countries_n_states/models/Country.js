var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var State = require("./State");

var countriesSchema = new Schema({
    name: { type: String, required: true },
    states: [{ type: Schema.Types.ObjectId, ref: 'State' }],
    continent: { type: String },
    population: { type: Number },
    ethnicity: [{ type: String }],
    neighbouring_countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
    area: { type: Number }
}, {
    timestamps: true
})

module.exports = mongoose.model("Country", countriesSchema);