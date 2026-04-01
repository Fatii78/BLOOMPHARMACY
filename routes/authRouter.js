const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

router.get("/sign-up", authController.showSignUpPage)
router.post("/sign-up", authController.registerAUser)
router.get("/sign-in", authController.showSignInPage)
router.post("/sign-in", authController.signInUser)
router.get("/sign-out", authController.signOutUser)
router.get("/profile", authController.getProfile)

module.exports = router
