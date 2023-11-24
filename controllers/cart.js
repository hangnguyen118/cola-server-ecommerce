const cartRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/user')

cartRouter.get('/:username', async (request, response) => {
  const { username } = request.params;
  try {
    const user = await User.findOne({ username }).populate('cart.product', 'id name price image');
    response.json(user.cart)
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Server error' });
  }
});

cartRouter.post('/clearCart', async (request, response) => {
  const { userId } = request.body;
  const user = await User.findById(userId).populate('cart');
  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }
  user.cart = []
  await user.save();
  response.status(200).end();
});

cartRouter.post('/', async (request, response) => {
  const { userId, productId } = request.body;
  const user = await User.findById(userId).populate('cart.product', 'id name price image');
  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  const product = await Product.findById(productId).select('id name price image');
  const cartItem = await user.cart.find(item => item.product._id.toString() === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    user.cart.push({ product, quantity: 1 });
  }
  await user.save();
  response.json(user.cart);
});

cartRouter.delete('/:userId/:productId', async (request, response) => {
  const { userId, productId } = request.params

  try {
    const user = await User.findOne({ _id: userId }).populate('cart.product', 'id name price image');
    if (!user) {
      return response.status(404).json({ error: 'User not found!' })
    }
    user.cart = user.cart.filter(item => item.product.id !== productId)
    await user.save()
    response.status(200).json(user.cart)
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
})

module.exports = cartRouter