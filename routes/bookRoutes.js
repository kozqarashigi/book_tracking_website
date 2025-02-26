const express = require("express");
const Book = require("../models/Book");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all books for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user._id });
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new book
router.post('/add', protect, async (req, res) => {
    try {
        const { title, author, status, rating } = req.body;
        
        const newBook = new Book({
            title,
            author,
            status,
            rating: status === "completed" ? rating : null,
            userId: req.user._id
        });
        
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update book
router.put("/:id", protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        // Check if book exists
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        
        // Check if user owns the book
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized to update this book" });
        }
        
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete book
router.delete("/:id", protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        // Check if book exists
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        
        // Check if user owns the book
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized to delete this book" });
        }
        
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted" });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;