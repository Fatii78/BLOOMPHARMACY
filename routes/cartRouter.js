const express = require("express")
const router = express.Router()

const cartController = require("../controllers/cartController")

router.get("/", cartController.showCart)
router.post("/add", cartController.addToCart)
router.post("/update", cartController.updateQty)

module.exports = router
