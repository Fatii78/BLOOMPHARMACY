const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

router.post("/:id", reviewController.createReview)
router.get("/", reviewController.listAllReviews)

module.exports = router
