const express = require('express');
const { isAdmin, protect } = require('../middleware/authMiddleware');
const { getUsers, addUser, updateUser, deleteUser, getBooks, addBook, updateBook, deleteBook } = require('../controllers/adminController');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('admin', { user: req.user }); 
});

router.get('/users', getUsers);
router.post('/users', addUser); 
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/books', getBooks);
router.post('/books', addBook); 
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

module.exports = router;