const mongoose = require('mongoose')

const paymentMethodsSchema = new mongoose.Schema({
    name: String,
})

paymentMethodsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('paymentMethods', paymentMethodsSchema)