# Book Tracking Website

## Team members:
- Ulzhan Tamyzgazina SE-2325
- Dilyara Akhmetova SE-2325

## Project Overview
This is a **Book Tracking Website** built with **Node.js, Express.js, and MongoDB**. It allows users to register, log in, manage their profile, and track books they have read, are currently reading, or plan to read. Also, admins have their own panel where they can see and manage users and books. 

## Project Setup

### 1. Clone the repository:
```bash
git clone <https://github.com/kozqarashigi/book_tracking_website>
cd <book_tracking_website>
```

### 2. Install dependencies:
```bash
npm install
```

#### Installed Libraries:
- **Express.js** (Web framework)
  ```bash
  npm install express
  ```
- **Mongoose** (MongoDB ODM)
  ```bash
  npm install mongoose
  ```
- **dotenv** (Environment variable management)
  ```bash
  npm install dotenv
  ```
- **EJS** (Template engine)
  ```bash
  npm install ejs
  ```
- **express-session** (Session management)
  ```bash
  npm install express-session
  ```
- **connect-mongo** (MongoDB session store)
  ```bash
  npm install connect-mongo
  ```
- **nodemon** (Development tool for automatic server restarts)
  ```bash
  npm install --save-dev nodemon
  ```

### 3. Setup environment variables:
Create a `.env` file in the root directory and add the following:
```bash
PORT=5000
MONGO_URI=<our-mongodb-connection-string>
JWT_SECRET=<our-secret-key>
```

### 4. Run the server:
```bash
npm run dev
```

## API Documentation

### Public Endpoints
- **Register a new user:**
  ```http
  POST /api/users/register
  ```
  - Request Body:
    ```json
    {
      "username": "exampleUser",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "message": "User registered successfully",
      "token": "jwt_token_here"
    }
    ```

- **Login a user:**
  ```http
  POST /api/users/login
  ```
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "message": "Login successful",
      "token": "jwt_token_here"
    }
    ```

### Private Endpoints (Requires Authentication)
- **Get user profile:**
  ```http
  GET /api/users/profile
  ```
- **Update user profile:**
  ```http
  PUT /api/users/profile
  ```
- **Create a new book:**
  ```http
  POST /api/books
  ```
- **Retrieve all books:**
  ```http
  GET /api/books
  ```
- **Retrieve a specific book by ID:**
  ```http
  GET /api/books/:id
  ```
- **Update a specific book:**
  ```http
  PUT /api/books/:id
  ```
- **Delete a specific book:**
  ```http
  DELETE /api/books/:id
  ```

## Deployment
Deploy the project, use platforms like **Render, Replit, or Railway**. Store sensitive information (e.g., database connection strings, JWT secret) in environment variables.

```bash
nodemon server.js
```
## MIT License
MIT License

Copyright (c) 2025 ulzhan-dilyara

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
