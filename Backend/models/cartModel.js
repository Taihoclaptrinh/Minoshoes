import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 1 },
    },
  ],
}, { timestamps: true });

// Phương thức để tính tổng giá trị giỏ hàng
cartSchema.methods.calculateTotalPrice = function() {
  return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
};

// Phương thức để thêm sản phẩm vào giỏ hàng
cartSchema.methods.addItemToCart = async function(productId, quantity, price) {
  const cart = this;
  const existingItemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId.toString());
  
  if (existingItemIndex >= 0) {
    // Sản phẩm đã tồn tại trong giỏ hàng
    cart.cartItems[existingItemIndex].quantity += quantity;
    cart.cartItems[existingItemIndex].price = price; // cập nhật giá
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    cart.cartItems.push({ product: productId, quantity, price });
  }

  return cart.save();
};

export default mongoose.model('Cart', cartSchema, 'carts');
