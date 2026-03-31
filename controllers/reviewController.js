const Review = require("../models/Review")
const Product = require("../models/Product")

// Renderreview page
const showReviewPage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send("Product not found")

    res.render("product/show", { product })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

// Handle review
const createReview = async (req, res) => {
  try {
    if (!req.session.user) return res.send("You must sign in first")

    const { rating, comment } = req.body
    const productId = req.params.id

    if (!rating || !comment) return res.send("Rating and comment are required")

    await Review.create({
      userId: req.session.user._id,
      productId,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    })

    res.redirect(`/products/${productId}`)
  } catch (error) {
    res.send(error.message)
  }
}

//list all reviews
const listAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username")
      .populate("productId", "name")
    res.render("reviews/list", { reviews })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = {
  showReviewPage,
  createReview,
  listAllReviews,
}
