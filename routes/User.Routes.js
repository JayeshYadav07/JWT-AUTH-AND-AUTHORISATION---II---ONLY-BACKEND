const express = require("express");
const { UserModel } = require("../model/User.Model");
const { BlacklistModel } = require("../model/Blacklist.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userRoutes = express.Router();

// /signup, /login, /logout

userRoutes.post("/signup", async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const userPresent = await UserModel.find({ email: email });
        if (userPresent.size > 0) {
            return res
                .status(400)
                .json({ message: "User is already present." });
        }

        const hashed_password = bcrypt.hashSync(password, 4);
        const user = new UserModel({ email, password: hashed_password, role });
        await user.save();

        res.json({ message: "User created successfully" });
    } catch (error) {
        res.send({ message: "Something went wrong", error: error.message });
    }
});

userRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "username and password is wrong" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Wrong credential" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60,
        });
        const reftoken = jwt.sign(
            { userId: user._id },
            process.env.REF_SECRET,
            { expiresIn: 300 }
        );
        return res.status(200).json({
            message: "User login successfully",
            token: token,
            reftoken: reftoken,
        });
    } catch (error) {
        res.send({ message: "Something went wrong", error: error.message });
    }
});
userRoutes.get("/logout", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const blacklist = new BlacklistModel({ token });
    await blacklist.save();
    return res.status(200).json({ message: "User logged out successfully" });
});
userRoutes.get("/apiRefresh", async (req, res) => {
    const reftoken = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(reftoken, process.env.REF_SECRET);
        const { userId } = decoded;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60,
        });

        res.send({ token });
    } catch (error) {
        return res.status(403).json({ message: "Login First" });
    }
});

module.exports = {
    userRoutes,
};
