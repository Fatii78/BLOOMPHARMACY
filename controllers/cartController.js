const Product = require("../models/Product")

const showCart = (req, res) => {
  const cart = req.session.cart || { items: [] }
  res.render("cart/index", { cart })
}

const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body
    const quantity = Number(qty) || 1

    const product = await Product.findById(productId)
    if (!product) return res.status(404).send("Product not found")

    if (!req.session.cart) req.session.cart = { items: [] }

    const existing = req.session.cart.items.find(
      (i) => i.productId === String(product._id)
    )

    if (existing) {
      existing.qty += quantity
    } else {
      req.session.cart.items.push({
        productId: String(product._id),
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || "",
        qty: quantity,
      })
    }

    res.redirect("/cart")
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message })
  }
}

const updateQty = (req, res) => {
  try {
    const { productId, action } = req.body

    if (!req.session.cart) req.session.cart = { items: [] }

    const item = req.session.cart.items.find((i) => i.productId === productId)
    if (!item) return res.redirect("/cart")

    if (action === "inc") item.qty += 1
    if (action === "dec") item.qty -= 1


    if (item.qty <= 0) {
      req.session.cart.items = req.session.cart.items.filter(
        (i) => i.productId !== productId
      )
    }

    res.redirect("/cart")
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message })
  }
}

module.exports = { showCart, addToCart, updateQty }
