const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true, min: 0  },
    stock : {type: Number, default: 0, min: 0},
    category: {
  type: String,
  enum: ["Skincare", "Haircare", "Nails", "Vitamins"],
  required: true
}},
  { timestamps: true }
)
module.exports = mongoose.model("Product", ProductSchema)
