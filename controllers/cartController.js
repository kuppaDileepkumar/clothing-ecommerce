import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get current user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image stock"
    );
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, size, qty } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      // Item exists → update quantity
      cart.items[itemIndex].qty += qty;
    } else {
      // New item → add
      cart.items.push({ product: productId, size, qty });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price image stock");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  const { productId, size, qty } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex === -1) return res.status(404).json({ message: "Item not in cart" });

    cart.items[itemIndex].qty = qty;
    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price image stock");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { productId, size } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price image stock");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart after order placement
export const clearCart = async (userId) => {
  try {
    await Cart.findOneAndDelete({ user: userId });
  } catch (err) {
    console.error("Failed to clear cart:", err.message);
  }
};
