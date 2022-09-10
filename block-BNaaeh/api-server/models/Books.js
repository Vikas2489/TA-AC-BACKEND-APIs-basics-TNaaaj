var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Comment = require("../models/Comments");

var bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Book", bookSchema);