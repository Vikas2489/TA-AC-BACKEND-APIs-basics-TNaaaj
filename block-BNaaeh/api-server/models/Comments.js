var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Book = require('./Books');

var commentSchema = new Schema({
    content: { type: String },
    likes: { type: Number, default: 0 },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' }
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema);