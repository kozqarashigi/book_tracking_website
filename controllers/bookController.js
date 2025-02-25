const asyncHandler = require("express-async-handler");

// @desc Add a new book
const Book = require("../models/Book");

const addBook = asyncHandler(async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, author, status, rating } = req.body;
    const newBook = new Book({ title, author, status, rating, userId: req.session.user._id });

    await newBook.save();
    res.status(201).json(newBook);
});


const getBooks = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Books retrieved successfully" });
});

const getBookById = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Book ${req.params.id} retrieved` });
});

const updateBook = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Book ${req.params.id} updated` });
});

const deleteBook = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Book ${req.params.id} deleted` });
});


module.exports = {
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};
