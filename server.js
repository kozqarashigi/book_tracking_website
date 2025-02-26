const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/users");
const Book = require("./models/Book"); 
const cors = require("cors");
const { protect, isAdmin } = require("./middleware/authMiddleware");


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



// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

// Homepage
app.get("/", (req, res) => {
    res.render("index", { user: req.user || null }); 
});

app.get('/api/books', protect, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user._id });
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Authentication Pages
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

app.use("/api/auth", authRoutes);
app.use("/api/books", protect, bookRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/admin", adminRoutes);


// Dashboard
app.get("/dashboard", async (req, res) => {
    try {
        res.render("dashboard", { user: req.user});
    } catch (error) {
        console.error("Error fetching books:", error);
        res.render("dashboard", { user: req.user});
    }
});


app.get('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});



// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
