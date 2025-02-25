document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooks();

    document.getElementById("add-book-btn").addEventListener("click", function () {
        document.getElementById("book-form-container").style.display = "block";
        document.getElementById("book-form-backdrop").classList.remove("hidden"); 
    });

    document.getElementById("close-form-btn").addEventListener("click", function () {
        document.getElementById("book-form-container").style.display = "none";
        document.getElementById("book-form-backdrop").classList.add("hidden"); 
    });

    document.getElementById("status").addEventListener("change", function () {
        document.getElementById("rating-container").style.display = this.value === "completed" ? "block" : "none";
    });

    document.querySelectorAll(".star").forEach(star => {
        star.addEventListener("click", function () {
            const rating = this.getAttribute("data-value");
            document.getElementById("rating").value = rating;

            document.querySelectorAll(".star").forEach(s => {
                s.style.color = s.getAttribute("data-value") <= rating ? "gold" : "gray";
            });
        });
    });

    document.getElementById("book-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const status = document.getElementById("status").value || "wishlist";

        const rating = status === "completed" ? Number(document.getElementById("rating").value) || null : null;
    
        if (!title || !author) {
            alert("Title and Author are required!");
            return;
        }
    
        await fetch("/api/books/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title, author, status, rating }),
        });
    
        document.getElementById("book-form-container").style.display = "none";
        document.getElementById("book-form-backdrop").classList.add("hidden"); 
        fetchBooks();
    });
    
});

async function fetchBooks() {
    try {
        const response = await fetch("/api/books");
        const books = await response.json();

        document.getElementById("wishlist-books").innerHTML = "";
        document.getElementById("reading-books").innerHTML = "";
        document.getElementById("completed-books").innerHTML = "";

        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            let ratingStars = "";
            if (book.status === "completed" && book.rating) {
                const rating = Math.min(5, Math.max(1, book.rating));
                ratingStars = "⭐".repeat(rating);
            }

            bookCard.innerHTML = `
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                ${ratingStars ? `<p class="stars">${ratingStars}</p>` : ""}
            `;

            if (book.status === "wishlist") {
                bookCard.innerHTML += `
                    <button onclick="updateBook('${book._id}', 'reading')">Mark as Reading</button>
                    <button onclick="updateBook('${book._id}', 'completed')">Mark as Completed</button>
                    <button onclick="deleteBook('${book._id}')">Delete</button>
                `;
                document.getElementById("wishlist-books").appendChild(bookCard);
            } else if (book.status === "reading") {
                bookCard.innerHTML += `
                    <button onclick="updateBook('${book._id}', 'completed')">Mark as Completed</button>
                    <button onclick="deleteBook('${book._id}')">Delete</button>
                `;
                document.getElementById("reading-books").appendChild(bookCard);
            } else if (book.status === "completed") {
                bookCard.innerHTML += `
                    <button onclick="rateBook('${book._id}')">Rate this book</button>
                    <button onclick="deleteBook('${book._id}')">Delete</button>
                `;
                document.getElementById("completed-books").appendChild(bookCard);
            }
        });
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

async function updateBook(id, status) {
    await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    fetchBooks();
}

async function deleteBook(id) {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    fetchBooks();
}

async function rateBook(id) {
    const rating = prompt("Rate this book from 1 to 5:");
    if (!rating || rating < 1 || rating > 5) return alert("Invalid rating!");

    await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
    });

    fetchBooks();
}
