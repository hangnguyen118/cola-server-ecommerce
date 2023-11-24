const mongoose = require('mongoose')

const shippingMethodSchema = new mongoose.Schema({
    name: String,
    price: Number,
})

shippingMethodSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema)