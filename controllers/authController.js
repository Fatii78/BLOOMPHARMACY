const bcrypt = require("bcrypt")

const User = require("../models/User.js")

const showSignUpPage = (req, res) => {
  try {
    res.render("auth/sign-up.ejs")
  } catch (error) {
    res.status(404).json({
      message: "⚠️ A error has occurred showing the Sign Up Page!",
      error: error.message,
    })
  }
}

const registerAUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ username: req.body.username })
    if (userInDatabase) {
      return res.send("❌ Username already taken!")
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("❌ Password and Confirm Password must match!")
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hashedPassword
    const user = await User.create(req.body)
    res.send(`🙏 Thanks for signing up ${user.username}!`)
  } catch (error) {
    res.status(500).json({
      message: "⚠️ An error has occurred registering a user!",
      error: error.message,
    })
  }
}

const showSignInPage = async (req, res) => {
  try {
    res.render("./auth/sign-in.ejs")
  } catch (error) {
    res.status(404).json({
      message: "⚠️ An error has occurred showing the Sign In Page!",
      error: error.message,
    })
  }
}

const signInUser = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      return res.send("❌ Login failed. Please try again.")
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send("❌ Login failed. Please try again.")
    }
    req.session.user = {
      username: userInDatabase.username,
    }
    req.session.save(() => {
      res.redirect("/")
    })
  } catch (error) {
    res.status(500).json({
      message: "⚠️ An error has occurred signing in a user!",
      error: error.message,
    })
  }
}

const signOutUser = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/")
    })
  } catch (error) {
    res.status(500).json({
      message: "⚠️ An error has occurred signing out a user!",
      error: error.message,
    })
  }
}

module.exports = {
  showSignUpPage,
  registerAUser,
  showSignInPage,
  signInUser,
  signOutUser,
}
