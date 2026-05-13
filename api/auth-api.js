const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

// Example user database
const users = [
    { email: "user@example.com", password: bcrypt.hashSync("user123", 10), role: "user" },
    { email: "admin@example.com", password: bcrypt.hashSync("admin123", 10), role: "admin" },
];

// Login API
app.post("/login", (req, res) => {
    const { email, password, role } = req.body;
    const user = users.find((u) => u.email === email && u.role === role);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid email, password, or role" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, role: user.role }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
});

app.listen(3000, () => console.log("Server running on port 3000"));