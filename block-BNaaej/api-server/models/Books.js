var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Comment = require("../models/Comments");
var Category = require("../models/Category");

var bookSchema = new Schema({
    title: { type: String, unique: true, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model("Book", bookSchema);