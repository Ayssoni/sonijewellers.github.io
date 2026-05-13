document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // API endpoint (could be dynamic/fetched from your backend)
    const loginEndpoint = "/api/auth-api.js";

    // Send login request
    try {
        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login successful!");
            // Redirect based on role
            if (role === "admin") {
                window.location.href = "/admin.html";
            } else {
                window.location.href = "/index.html";
            }
        } else {
            alert(data.message || "Login failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});