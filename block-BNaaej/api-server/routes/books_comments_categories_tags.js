var express = require('express');
var router = express.Router();
var Book = require("../models/Books");
var Comment = require("../models/Comments");
var Category = require("../models/Category");

// post a book
router.post("/books", (req, res, next) => {
    Book.create(req.body, (err, book) => {
        if (err) return next(err);
        return res.status(200).json({ book });
    });
});

// listing all tags 
router.get("/books/tags", (req, res, next) => {
    Book.distinct('tags', (err, allTags) => {
        if (err) return next(err);
        return res.status(200).json({ allTags });
    });
});

// list tags in ascending/descending order
router.get("/books/tags/ascending", (req, res, next) => {
    Book.distinct('tags', (err, allTags) => {
        if (err) return next(err);
        allTags.sort();
    });
});

// filter books by tags
router.get("/books/:tag/tags", (req, res, next) => {
    let tag = req.params.tag;
    Book.find({ tags: tag }, (err, book) => {
        if (err) return next(err);
        return res.status(200).json({ book });
    })
});

// get count of number of books for each tag
router.get("/books/each_tags", (req, res, next) => {
    Book.aggregate([{ $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }], (err, numberOfBookBasedOnTag) => {
        if (err) return next(err);
        return res.status(200).json({ numberOfBookBasedOnTag });
    })
});

// list books by author
router.get("/books/:author_name/author", (req, res, next) => {
    let author = req.params.author_name;
    Book.findOne({ author }).exec((err, book) => {
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
    });
});

// count books for each category
router.get("/category/each_category_books", (req, res, next) => {
    Category.find({}, (err, categoriesArr) => {
        if (err) return next(err);
        let obj = categoriesArr.reduce((acc, cv) => {
            console.log(cv, acc);
            acc[cv.name] = cv.bookId.length;
            return acc;
        }, {});
        return res.status(200).json({ obj });
    })
});

// create a category
router.post("/category/:bookId", (req, res, next) => {
    let bookId = req.params.bookId;
    req.body.bookId = bookId;
    Category.create(req.body, (err, category) => {
        if (err) return next(err);
        Book.findByIdAndUpdate(bookId, { $push: { category: category.id } }, (err, updatedBook) => {
            if (err) return next(err);
            return res.status(200).json({ category, updatedBook });
        });
    });
});

// edit a category 
router.put("/category/:categoryId", (req, res, next) => {
    let categoryId = req.params.categoryId;
    Category.findByIdAndUpdate(categoryId, req.body, (err, updatedCategory) => {
        if (err) return next(err);
        return res.status(200).json({ updatedCategory });
    });
});

// DELETE  A CATEGORY
router.delete("/category/:categoryId/delete", (req, res, next) => {
    let categoryId = req.params.categoryId;
    Category.findByIdAndDelete(categoryId, (err, deletedCategory) => {
        if (err) return next(err);
        deletedCategory.bookId.forEach(bookId => {
            Book.findByIdAndUpdate(bookId, { $pull: { category: deletedCategory.id } }, (err, updatedBook) => {
                if (err) return next(err);
                console.log(updatedBook);
            });
        });
        return res.status(200).json({ deletedCategory });
    });
});

// list books by category
router.get("/category/:category_name", (req, res, next) => {
    let category = req.params.category_name;
    Category.findOne({ name: category }).populate('bookId').exec((err, category) => {
        if (err) return next(err);
        return res.status(200).json({ Books: category.bookId });
    });
});

// list all categories
router.get("/category", (req, res, next) => {
    Category.distinct("name", (err, allCategories) => {
        if (err) return next(err);
        return res.status(200).json({ allCategories });
    });
});





module.exports = router;