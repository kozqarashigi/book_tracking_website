document.addEventListener("DOMContentLoaded", () => {
    // Login
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); 
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                alert("Login successful!");
                window.location.href = "/dashboard";
            } else {
                alert("Login failed!");
            }
        });
    }

    // Registration
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (res.ok) {
                alert("Registration successful!");
                window.location.href = "/login";
            } else {
                alert("Registration failed!");
            }
        });
    }
});