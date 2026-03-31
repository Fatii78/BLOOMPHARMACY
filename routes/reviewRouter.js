const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

// Render review page
router.get("/products/:id/review", reviewController.showReviewPage)

// Submit review
router.post("/products/:id/review", reviewController.createReview)

//list all reviews
router.get("/reviews", reviewController.listAllReviews)

module.exports = router
