const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

// Example admin data
const admin = { email: "admin@example.com", role: "admin" };

// Verify admin JWT token
app.post("/api/admin-auth", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "secretkey");
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        // Example statistics
        res.json({ totalUsers: 150, activeSessions: 32 });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});