const invoiceRouter = require('express').Router()
const Invoice = require('../models/invoice')
const User = require('../models/user')
const Product = require('../models/product')

invoiceRouter.get('/', async (request, response) => {
  const invoice = await Invoice.find({}).populate('user', { name: 1, phoneNumber: 1 })
  response.status(200).json(invoice)
})

invoiceRouter.get('/:userId', async (request, response) => {
  try {
    const userId = request.params.userId;
    const userInvoices = await Invoice.find({ 'user': userId }).populate('user', { name: 1, phoneNumber: 1 })
    response.status(200).json(userInvoices)
  } catch (error) {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  }
})

invoiceRouter.get('/id/:invoiceId', async (request, response) => {
  const invoiceId = request.params.invoiceId;
  try {
    const userInvoices = await Invoice.findById(invoiceId)
      .populate('creationDate totalAmount note paid shippingMethod paymentMethod accomplish')
      .populate('user', 'name location phoneNumber')
      .populate('items.product', 'name image')
      .select('items.quantity');
    response.json(userInvoices);
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: 'malformatted id' });
  }
});

invoiceRouter.post('/', async (request, response) => {
  try {
    const { totalAmount, note, userId, shippingMethod, paymentMethod } = request.body;

    // Lấy thông tin giỏ hàng của người dùng
    const userCart = await User.findById(userId).populate('cart.product', 'id name image total quantity');

    const items = userCart.cart.map((item) => {
      return {
        product: item.product,
        quantity: item.quantity
      };
    });

    const accomplish = false;

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const creationDate = `${day}/${month}/${year}`;
    const paid = false
    const user = await User.findById(userId).select('id name location phoneNumber cart');

    // Tạo hóa đơn mới
    const newInvoice = new Invoice({
      creationDate,
      totalAmount,
      paid,
      note,
      user,
      items,
      shippingMethod,
      paymentMethod,
      accomplish
    });

    const savedInvoice = await newInvoice.save();

    // Cập nhật số lượng sản phẩm tồn trong cơ sở dữ liệu
    for (const item of items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.total = await product.total + item.quantity;
        product.save();
      } else {
        throw new Error('Product not found');
      }
    }
    response.status(201).json(savedInvoice.id);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


invoiceRouter.put('/:id/complete', async (request, response) => {
  const { id } = request.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return response.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    invoice.accomplish = true;

    await invoice.save();
    const list = await Invoice.find({}).populate('user', { name: 1, phoneNumber: 1 })
    response.status(200).json(list);

  } catch (error) {
    response.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
});

invoiceRouter.patch('/:id/paid', async (request, response) => {
  const { id } = request.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return response.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    invoice.paid = true;

    const updatedInvoice = await invoice.save();
    response.status(200).json(updatedInvoice);

  } catch (error) {
    response.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
});

module.exports = invoiceRouter  