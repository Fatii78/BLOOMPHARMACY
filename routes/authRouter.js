const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController.js")

router.get("/", authController.showSignUpPage)
router.post("/", authController.registerAUser)
router.get("/", authController.showSignInPage)
router.post("/", authController.signInUser)
router.get("/", authController.signOutUser)

module.exports = router
