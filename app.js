const express = require('express')
const app = express()
const cors = require('cors')
const productsRouter = require('./controllers/products')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cartRouter = require('./controllers/cart')
const invoiceRouter = require('./controllers/invoice')
const categoryRouter = require('./controllers/category')
const path = require('path');
const paymentMethodsRouter = require('./controllers/paymentMethods')
const shippingMethodRouter = require('./controllers/shippingMethod')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/cart', cartRouter)
app.use('/api/invoice', invoiceRouter)
app.use('/api/category', categoryRouter)
app.use('/api/shipping', shippingMethodRouter)
app.use('/api/payment', paymentMethodsRouter)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app