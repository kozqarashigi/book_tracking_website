const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const Book = require("./models/Book"); 
const cors = require("cors");

dotenv.config(); 
const app = express();  

app.use(cors());  

// View Engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



// Middleware session
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true,
        },
    })
);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

// Homepage
app.get("/", (req, res) => {
    console.log("Session User:", req.session.user);
    res.render("index", { user: req.session.user || null });
});

app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();  // Fetch all books from MongoDB
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Authentication Pages
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// Authentication Routes
app.use("/api/auth", authRoutes);

// Book Routes
app.use("/api/books", bookRoutes);

// Dashboard
app.get("/dashboard", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {
        const books = await Book.find();
        res.render("dashboard", { user: req.session.user, books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.render("dashboard", { user: req.session.user, books: [] });
    }
});


app.post('/api/books/add', async (req, res) => {
    try {
        const { title, author, status, rating } = req.body;
        const newBook = new Book({
            title,
            author,
            status,
            rating: status === "completed" ? rating : null  // Сохраняем рейтинг только если "Completed"
        });
        await newBook.save();
        res.json({ message: "Book added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); 
    });
});



// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
