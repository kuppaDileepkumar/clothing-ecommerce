import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { sendOrderEmail } from "../Utility/sendEmail.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price stock image"
    );

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    // Stock validation
    for (let item of cart.items) {
      if (item.qty > item.product.stock) {
        return res.status(400).json({
          message: `${item.product.name} is out of stock`,
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      size: item.size,
      qty: item.qty,
      price: item.product.price,
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // Create order
    let order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      status: "Confirmed",
    });

    // Update stock for each product
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.qty },
      });
    }

    // Delete cart after ordering
    await Cart.findOneAndDelete({ user: userId });

    // Send confirmation email
    await sendOrderEmail(order, { email: req.user.email });

    // Populate product details for response
    order = await Order.findById(order._id).populate(
      "items.product",
      "name price image"
    );

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user's orders (order history)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price image");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price image"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ownership protection
    if (order.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
