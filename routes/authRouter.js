const express = require("express")
const router = express.Router()

router.get("/sign-up", (req, res) => {
  res.render("./auth/sign-up.ejs")
})
router.post("/sign-up", (req, res) => {
  const { username, password } = req.body
  res.redirect("/") //go to home page after sign up
})

router.get("/sign-in", (req, res) => {
  res.render("./auth/sign-in.ejs")
})

router.post("/sign-in", (req, res) => {
  req.session.user = req.body.username
  res.redirect("/")
})

router.post("/sign-out", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      return res.redirect("/")
    }
    res.clearCookie("connect.sid")
    res.redirect("/")
  })
})
const authController = require("../controllers/authController.js")

router.get("/", authController.showSignUpPage)
router.post("/", authController.registerAUser)
router.get("/", authController.showSignInPage)
router.post("/", authController.signInUser)
router.get("/", authController.signOutUser)

module.exports = router
