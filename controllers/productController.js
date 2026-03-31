const Product = require("../models/Product")

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { category, q } = req.query
    const filter = {}
    if (category) filter.category = category
    if (q && q.trim() !== "") {
      filter.name = { $regex: q.trim(), $options: "i" }
    }
    const products = await Product.find(filter)
    res.render("products/index", { products, category, q })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting products", error: error.message })
  }
}
// GET PRODUCT BY ID
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).send("Product not found")
    }
    res.render("products/show", { product })
  } catch (error) {
    res.status(500).json({
      message: "Error getting product details",
      error: error.message,
    })
  }
}

const getShowProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send("Product not found")

    const reviews = await Review.find({ productId: product._id }).populate(
      "userId",
      "username"
    )

    res.render("products/show", {
      product,
      reviews,
      user: req.session.user || null,
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = {
  getAllProducts,
  getProductDetails,
  getShowProduct,
}
