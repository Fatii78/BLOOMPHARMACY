const Review = require("../models/Review")
const Product = require("../models/Product")

//  review
const showReviewPage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    const reviews = await Review.find({ productId: req.params.id }).populate("userId", "username");
    res.render("product/show", { product, reviews });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// create review
const createReview = async (req, res) => {
  try {
    if (!req.session.user) {
       return res.redirect('/auth/sign-in');
    }
    const { rating, comment } = req.body;
    const productId = req.params.id;
    await Review.create({
      userId: req.session.user._id,
      productId: productId,
      rating: Number(rating),
      comment: comment,
    });
    res.redirect(`/products/${productId}`);

  } catch (error) {
    console.log("Error logic:", error);
    res.send(error.message);
  }
};
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
