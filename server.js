require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection (Fixed)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.set("view engine", "ejs");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ User Model
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String
});
const User = mongoose.model("User", UserSchema);

// ✅ Home Route
app.get("/", (req, res) => res.send("✅ Server is running!"));

// ✅ Dashboard Route
app.get("/dashboard", async (req, res) => {
    const users = await User.find();
    res.render("dashboard", { Admin: "Admin Dashboard", users, user: null, errorMessage: null });
});

// ✅ Add User Route
app.post("/add-user", async (req, res) => {
    const { name, email, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: "⚠️ User already exists!" });
    }

    const newUser = new User({ name, email, phone, address });
    await newUser.save();

    res.redirect("/dashboard");
});

// ✅ Edit User Route
app.get("/edit-user/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return res.status(404).send("User not found!");
    }

    const users = await User.find();
    res.render("dashboard", { Admin: "Edit User", users, user, errorMessage: null });
});

// ✅ Update User Route
app.post("/update-user/:id", async (req, res) => {
    const { name, email, phone, address } = req.body;
    
    await User.findByIdAndUpdate(req.params.id, { name, email, phone, address });

    res.redirect("/dashboard");
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
