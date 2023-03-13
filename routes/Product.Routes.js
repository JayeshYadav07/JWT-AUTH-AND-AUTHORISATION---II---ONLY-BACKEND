const express = require("express");
const { authenticate } = require("../middleware/Authenticate");
const { authorisation } = require("../middleware/Authorize");
const productRoutes = express.Router();

productRoutes.get("/showall", authenticate, (req, res) => {
    return res.status(200).json({ message: "Product..." });
});

// seller can access
productRoutes.post(
    "/addproducts",
    authenticate,
    authorisation(["seller"]),
    (req, res) => {
        return res.status(200).json({ message: "Product Added Successfully" });
    }
);
productRoutes.post(
    "/deleteproducts",
    authenticate,
    authorisation(["seller"]),
    (req, res) => {
        return res
            .status(200)
            .json({ message: "Product Deleted Successfully" });
    }
);

module.exports = { productRoutes };
