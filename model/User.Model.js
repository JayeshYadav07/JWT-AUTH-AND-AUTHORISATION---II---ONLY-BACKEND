const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "customer",
        enum: ["seller", "customer"],
    },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel,
};
