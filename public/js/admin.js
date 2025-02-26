// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to the selected button and corresponding section
        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}-section`).classList.add('active');
        
        // Load data for the selected tab
        if (button.dataset.tab === 'users') {
            loadUsers();
        } else {
            loadBooks();
        }
    });
});

// Edit user function
async function editUser(userId) {
    const token = getToken();

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: prompt('Enter new username:'),
                email: prompt('Enter new email:'),
                role: prompt('Enter new role (user/admin):')
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        loadUsers(); 
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

// Delete user function
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        loadUsers(); ъ
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Edit book function
async function editBook(bookId) {
    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`/admin/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: prompt('Enter new title:'),
                author: prompt('Enter new author:'),
                status: prompt('Enter new status (wishlist/reading/completed):'),
                rating: prompt('Enter new rating (1-5):')
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update book');
        }

        loadBooks();
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

// Delete book function
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`/admin/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete book');
        }

        loadBooks(); 
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}
// Load users
async function loadUsers() {
    try {
        const token = getToken();
        console.log('Token:', token);
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch('/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`  // Add JWT token to the header
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                logout();
                return;
            }
            throw new Error('Failed to load users');
        }

        const users = await response.json();
        
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="editUser('${user._id}')">Edit</button>
                    <button onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load books
async function loadBooks() {
    try {
        const token = getToken();
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch('/admin/books', {
            headers: {
                'Authorization': `Bearer ${token}`  // Add JWT token to the header
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                logout();
                return;
            }
            throw new Error('Failed to load books');
        }

        const books = await response.json();
        
        const tbody = document.getElementById('books-tbody');
        tbody.innerHTML = books.map(book => `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.status}</td>
                <td>${book.userId}</td>
                <td>${book.rating || 'N/A'}</td>
                <td>
                    <button onclick="editBook('${book._id}')">Edit</button>
                    <button onclick="deleteBook('${book._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Show add user modal
function showAddUserModal() {
    const modal = document.getElementById('add-user-modal');
    modal.classList.remove('hidden');
    modal.classList.add('active');
}

// Show add book modal
function showAddBookModal() {
    const modal = document.getElementById('add-book-modal');
    modal.classList.remove('hidden');
    modal.classList.add('active');
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    modal.classList.add('hidden');
}

// Handle add user form submission
document.getElementById('add-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Add JWT token to the header
            },
            body: JSON.stringify(userData),
        });
        
        if (response.ok) {
            hideModal('add-user-modal');
            loadUsers();
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

// Handle add book form submission
document.getElementById('add-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const formData = new FormData(e.target);
    const bookData = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/admin/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Add JWT token to the header
            },
            body: JSON.stringify(bookData),
        });
        
        if (response.ok) {
            hideModal('add-book-modal');
            loadBooks();
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
});

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('token');
    console.log(localStorage.getItem('token')); 
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Load users on initial page load
loadUsers();