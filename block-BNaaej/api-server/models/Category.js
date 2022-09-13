var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Book = require("../models/Books");

var categoriesSchema = new Schema({
    name: { type: String, unique: true, required: true },
    bookId: [{ type: Schema.Types.ObjectId, required: true, ref: "Book" }],
});

module.exports = mongoose.model("Category", categoriesSchema);