// Check if the admin is authenticated
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("adminToken"); // or session cookie if using cookies
    if (!token) {
        alert("Access Denied: Admin authentication required.");
        window.location.href = "/login.html";
    }

    try {
        const response = await fetch("/api/admin-auth", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Authentication failed!");
        }

        const adminData = await response.json();
        document.getElementById("total-users").textContent = adminData.totalUsers || "N/A";
        document.getElementById("active-sessions").textContent = adminData.activeSessions || "N/A";
    } catch (error) {
        console.error("Error:", error);
        alert("Access Denied: Invalid token.");
        window.location.href = "/login.html";
    }
});

// Logout function
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    alert("Logged out successfully!");
    window.location.href = "/login.html";
});

// Placeholder for admin actions
function manageUsers() {
    alert("User management coming soon!");
}

function editContent() {
    alert("Content editing features coming soon!");
}