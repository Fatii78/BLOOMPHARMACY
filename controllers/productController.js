const Product = require("../models/Product")

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query
    let products

    if (category) {
      products = await Product.find({
        //Ignore case
  category: { $regex: category, $options: "i" }
})
    } else {
      products = await Product.find({})
    }
    res.render("products/index", { products })
  } catch (error) {
    res.status(500).json({ message: "Error getting products",error: error.message })
  }
}

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
      error: error.message
    })
  }
}

module.exports = {
  getAllProducts,
  getProductDetails
}
