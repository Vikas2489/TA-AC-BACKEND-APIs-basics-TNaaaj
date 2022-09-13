var express = require('express');
var router = express.Router();
var Book = require("../models/Books");
var Comment = require("../models/Comments");

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

// listing all tags 
router.get("/books/tags", (req, res, next) => {
    Book.distinct('tags', (err, allTags) => {
        if (err) return next(err);
        return res.status(200).json({ allTags });
    });
});

// list tags in ascending/descending order
router.get("/books/tags", (req, res, next) => {
    Book.distinct('tags', (err, allTags) => {
        if (err) return next(err);
        allTags.sort();
    });
});

// filter books by tags
router.get("/books/:tag/tags", (req, res, next) => {
    let tag = req.params.tag;
    Book.find({ tag })
});

// create a comment
router.post("/:bookId/comments", (req, res, next) => {
    let bookId = req.params.bookId;
    req.body.bookId = bookId;
    Comment.create(req.body, (err, newComment) => {
        if (err) return next(err);
        Book.findByIdAndUpdate(bookId, { $push: { comment: newComment.id } }, (err, updatedBook) => {
            if (err) return next(err);
            return res.status(200).json({ updatedBook });
        })
    })
});

// get all comments on a book
router.get("/:bookId/comments", (req, res, next) => {
    let bookId = req.params.bookId;
    Comment.find({ bookId }, (err, comment) => {
        if (err) return next(err);
        return res.status(200).json({ comment });
    });
});

// update a comment 
router.put("/comments/:commentId", (req, res, next) => {
    let commentId = req.params.commentId;
    console.log(req.body);
    Comment.findByIdAndUpdate(commentId, req.body, (err, updatedComment) => {
        if (err) return next(err);
        return res.status(200).json({ updatedComment });
    })
});

// delete a comment 
router.delete("/comments/:commentId/delete", (req, res, next) => {
    let commentId = req.params.commentId;
    Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
        if (err) return next(err);
        Book.findByIdAndUpdate(deletedComment.bookId, { $pull: { comment: deletedComment.id } }, (err, updatedBook) => {
            if (err) return next(err);
            return res.status(200).json({ deletedComment });
        });

    })
})



module.exports = router;