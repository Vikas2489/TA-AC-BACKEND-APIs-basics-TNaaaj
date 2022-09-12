var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Country = require("./Country");

var statesSchema = new Schema({
    name: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, required: true, ref: 'Country' },
    population: { type: Number },
    neighbouring_states: [{ type: Schema.Types.ObjectId, ref: 'State' }],
    area: { type: Number },
}, {
    timestamps: true
});

module.exports = mongoose.model("State", statesSchema);