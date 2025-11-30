import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

const productImages = [];
for (let i = 1; i <= 20; i++) {
productImages.push(`https://picsum.photos/200/300?random=${i}`);
}

const products = [
{ name: "Blue T-Shirt", price: 499, image: productImages[0], description: "Comfortable cotton T-Shirt", category: "T-Shirt", brand: "Clothing", stock: 20 },
{ name: "Red Hoodie", price: 999, image: productImages[1], description: "Warm hoodie for winter", category: "Hoodie", brand: "Clothing", stock: 15 },
{ name: "Black Jeans", price: 1299, image: productImages[2], description: "Stylish slim-fit jeans", category: "Jeans", brand: "Clothing", stock: 25 },
{ name: "White Dress", price: 1599, image: productImages[3], description: "Elegant summer dress", category: "Dress", brand: "Clothing", stock: 10 },
{ name: "Green Jacket", price: 1999, image: productImages[4], description: "Lightweight jacket for all seasons", category: "Jacket", brand: "Clothing", stock: 12 },
{ name: "Grey Sweatshirt", price: 799, image: productImages[5], description: "Comfortable casual sweatshirt", category: "Sweatshirt", brand: "Clothing", stock: 18 },
{ name: "Yellow T-Shirt", price: 499, image: productImages[6], description: "Bright cotton T-Shirt", category: "T-Shirt", brand: "Clothing", stock: 22 },
{ name: "Pink Hoodie", price: 1099, image: productImages[7], description: "Soft hoodie with pouch", category: "Hoodie", brand: "Clothing", stock: 14 },
{ name: "Denim Shorts", price: 699, image: productImages[8], description: "Casual summer shorts", category: "Shorts", brand: "Clothing", stock: 20 },
{ name: "Black Leather Jacket", price: 2999, image: productImages[9], description: "Stylish leather jacket", category: "Jacket", brand: "Clothing", stock: 8 },
{ name: "Orange Dress", price: 1499, image: productImages[10], description: "Casual orange dress", category: "Dress", brand: "Clothing", stock: 10 },
{ name: "Navy Blue Jeans", price: 1299, image: productImages[11], description: "Classic slim jeans", category: "Jeans", brand: "Clothing", stock: 20 },
{ name: "Purple Sweatshirt", price: 899, image: productImages[12], description: "Comfortable casual sweatshirt", category: "Sweatshirt", brand: "Clothing", stock: 16 },
{ name: "Brown Jacket", price: 1999, image: productImages[13], description: "Stylish jacket for autumn", category: "Jacket", brand: "Clothing", stock: 12 },
{ name: "White Hoodie", price: 999, image: productImages[14], description: "Minimalist hoodie", category: "Hoodie", brand: "Clothing", stock: 14 },
{ name: "Red Shorts", price: 699, image: productImages[15], description: "Casual red shorts", category: "Shorts", brand: "Clothing", stock: 18 },
{ name: "Light Blue Dress", price: 1599, image: productImages[16], description: "Summer light dress", category: "Dress", brand: "Clothing", stock: 12 },
{ name: "Black T-Shirt", price: 499, image: productImages[17], description: "Basic black T-Shirt", category: "T-Shirt", brand: "Clothing", stock: 25 },
{ name: "Grey Hoodie", price: 1099, image: productImages[18], description: "Casual grey hoodie", category: "Hoodie", brand: "Clothing", stock: 15 },
{ name: "Green T-Shirt", price: 499, image: productImages[19], description: "Eco-friendly cotton T-Shirt", category: "T-Shirt", brand: "Clothing", stock: 20 },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    await Product.deleteMany();
    console.log("Previous products deleted...");

    await Product.insertMany(products);
    console.log("Products seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
