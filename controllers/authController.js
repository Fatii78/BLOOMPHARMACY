const bcrypt = require("bcrypt")

const User = require("../models/User.js")

// SHOW SIGN UP PAGE
const showSignUpPage = async (req, res) => {
  try {
    res.render("./auth/sign-up.ejs")
  } catch (error) {
    res.status(404).json({
      message: "⚠️ An error has occurred showing the Sign Up Page!",
      error: error.message,
    })
  }
}

// REGISTER USER
const registerAUser = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.send("❌ Passwords do not match")
    }

    const userInDatabase = await User.findOne({ username })

    if (userInDatabase) {
      return res.send("❌ Username already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      password: hashedPassword,
    })

    req.session.user = {
      username: newUser.username,
    }

    req.session.save(() => {
      res.redirect("/")
    })
  } catch (error) {
    res.status(500).json({
      message: "⚠️ An error has occurred registering a user!",
      error: error.message,
    })
  }
}

// SHOW SIGN IN PAGE
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

// SIGN IN USER
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
      message: "⚠️ Error signing out",
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
