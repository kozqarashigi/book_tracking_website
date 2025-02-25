const express = require("express");
const Book = require("../models/Book");
const router = express.Router();


router.get('/books', async (req, res) => {
    try {
        const books = await Book.find(); // Fetch all books
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;


router.post('/add', async (req, res) => {
    try {
        const { title, author } = req.body;
        const userId = req.session.user ? req.session.user.id : null; // Ensure userId is retrieved

        if (!userId) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        const newBook = new Book({ title, author, userId });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



// Update book status
router.put("/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Delete book
router.delete("/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
