const Product = require("../models/product")

// GET products
const getAllProducts = async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.render("products/index", { products, selectedCategory: req.query.category || "" })
  } catch (error) {
    res.status(500).send(error.message)
  }
}


module.exports = {
  getAllProducts
}
