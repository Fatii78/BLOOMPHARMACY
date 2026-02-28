require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const methodOverride = require("method-override")
const session = require("express-session")
const MongoStore = require("connect-mongo").default
const path = require("path")

const app = express()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan("dev"))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)

app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

app.set("view engine", "ejs")

// DB
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected")
})

// Routes
app.get("/", (req, res) => {
  res.render("index")
})

const indexRouter = require("./routes/indexRouter")
//const authRouter = require("./routes/authRouter")
const productRouter = require("./routes/productRouter")
//const cartRouter = require("./routes/cartRouter")

app.use("/", indexRouter)
//app.use("/auth", authRouter)
app.use("/products", productRouter)
//app.use("/cart", cartRouter)

const PORT = 3000
app.listen(PORT, () => {
  console.log("Server running on port 3000")
})
