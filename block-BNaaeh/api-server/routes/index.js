var express = require('express');
var router = express.Router();
var Book = require("../models/Books");


// post a book
router.post("/books", (req, res, next) => {
    Book.create(req.body, (err, book) => {
        if (err) return next(err);
        return res.status(200).json({ book });
    });
});

/* list all books */
router.get('/books', function(req, res, next) {
    Book.find({}, (err, booksArr) => {
        if (err) return next(err);
        let bookNamesArr = booksArr.map(book => {
            return book.title;
        });
        return res.status(200).json({ bookNamesArr });
    })
});

// get a single book detail 
router.get("/books/:id", (req, res, next) => {
    let bookId = req.params.id;
    Book.findById(bookId, (err, book) => {
        if (err) return next(err);
        return res.json({ book });
    })
});

// update a book
router.put("/books/:id", (req, res, next) => {
    let bookId = req.params.id;
    Book.findByIdAndUpdate(bookId, req.body, (err, updatedBook) => {
        if (err) return next(err);
        return res.status(200).json({ updatedBook });
    })
});

// delete a book
router.delete("/books/:id", (req, res, next) => {
    let bookId = req.params.id;
    Book.findByIdAndDelete(bookId, (err, deletedBook) => {
        if (err) return next(err);
        return res.status(200).json({ deletedBook });
    })
});


module.exports = router;