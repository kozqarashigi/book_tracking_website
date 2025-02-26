const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    status: { type: String, enum: ["wishlist", "reading", "completed"], default: "wishlist", required: true },
    rating: { type: Number, min: 1, max: 5 }
});

module.exports = mongoose.model("Book", bookSchema);


