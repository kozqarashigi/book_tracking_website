const User = require('../models/User');
const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const addUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }
        await user.save();
        res.json({ message: 'User updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        res.json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({});
    res.json(books);
});

const addBook = asyncHandler(async (req, res) => {
    const { userId, title, author, status, rating } = req.body;
    const newBook = new Book({ userId, title, author, status, rating });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
});

const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
        book.userId = req.body.userId || book.userId;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.status = req.body.status || book.status;
        book.rating = req.body.rating || book.rating;
        await book.save();
        res.json({ message: 'Book updated successfully' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book) {
        res.json({ message: 'Book deleted successfully' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getBooks,
    addBook,
    updateBook,
    deleteBook
};