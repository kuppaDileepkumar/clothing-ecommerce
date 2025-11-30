import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  brand: String,
  countInStock: Number,
});

export default mongoose.model("Product", productSchema);
