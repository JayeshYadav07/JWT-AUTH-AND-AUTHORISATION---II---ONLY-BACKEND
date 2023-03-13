const express = require("express");
const { connection } = require("./config/db");
const { userRoutes } = require("./routes/User.Routes");
const { productRoutes } = require("./routes/Product.Routes");
require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server working");
});
app.use("/user", userRoutes);
app.use("/products", productRoutes);

app.listen(process.env.PORT, async (req, res) => {
    try {
        await connection;
        console.log("Connected to Database");
    } catch (error) {
        console.log(error);
    }
    console.log("server listening on port " + process.env.PORT);
});
