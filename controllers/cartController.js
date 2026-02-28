const Product = require("../models/Product")

const ensureCart = (req) => {
  if (!req.session.cart) req.session.cart = {}
  if (!Array.isArray(req.session.cart.items)) req.session.cart.items = []
}

const showCart = (req, res) => {
  ensureCart(req)
  return res.render("cart/index", { cart: req.session.cart })
}

const addToCart = async (req, res) => {
  try {
    ensureCart(req)
    console.log("ADD TO CART BODY:", req.body)
    const { productId, qty } = req.body
    const quantity = Number(qty) || 1
    if (!productId) {
      return res.status(400).json({ message: "Missing productId in request body" })
    }
    const product = await Product.findById(productId)
    if (!product) return res.status(404).send("Product not found")
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
    req.session.save(() => {
      return res.redirect("/cart")
    })
  } catch (error) {
    return res.status(500).json({ message: "Error adding to cart",error: error.message, })
  }
}


const updateQty = (req, res) => {
  try {
    ensureCart(req)
    console.log("UPDATE QTY BODY:", req.body)
    const { productId } = req.params
const { action } = req.body
    const item = req.session.cart.items.find((i) => i.productId === productId)
    if (!item) {
      return res.redirect("/cart")
    }
    if (action === "inc") item.qty += 1
    if (action === "dec") item.qty -= 1
    if (item.qty <= 0) {
      req.session.cart.items = req.session.cart.items.filter(
        (i) => i.productId !== productId
      )
    }
    req.session.save(() => {
      return res.redirect("/cart")
    })
  } catch (error) {
    return res.status(500).json({ message: "Error updating cart",error: error.message })
 }
}


const deleteItem = (req, res) => {
  try {
    ensureCart(req)
    const { productId } = req.params
    req.session.cart.items = req.session.cart.items.filter(
      (i) => i.productId !== productId
    )
    req.session.save(() => res.redirect("/cart"))
  } catch (error) {
    return res.status(500).json({ message: "Error deleting item", error: error.message })
  }
}

const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect("/auth/sign-in")
  next()
}

const checkout = (req, res) => {
  try {
    ensureCart(req)
    if (req.session.cart.items.length === 0) return res.redirect("/cart")
    const subtotal = req.session.cart.items.reduce(
      (sum, item) => sum + (item.price * item.qty),
      0
    )
    const delivery = 2
    const isFirstOrder = !req.session.hasOrderedBefore
    const discountRate = isFirstOrder ? 0.10 : 0
    const discountAmount = subtotal * discountRate
    const total = (subtotal - discountAmount) + delivery
    req.session.hasOrderedBefore = true
    req.session.cart.items = []
    req.session.save(() => {
      res.render("cart/success", {
        subtotal,
        delivery,
        discountAmount,
        total,
        isFirstOrder
      })
    })
  } catch (error) {
    return res.status(500).json({ message: "Error checkout", error: error.message })
  }
}

module.exports = { showCart,
   addToCart,
    updateQty,
    deleteItem,
    checkout,
    requireAuth
  }
