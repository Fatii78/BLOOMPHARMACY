const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

// SIGN UP
router.get("/sign-up", authController.showSignUpPage)
router.post("/sign-up", authController.registerAUser)

// SIGN IN
router.get("/sign-in", authController.showSignInPage)
router.post("/sign-in", authController.signInUser)

// SIGN OUT
router.post("/sign-out", authController.signOutUser)

module.exports = router
