const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const invoiceSchema = new mongoose.Schema({
    creationDate: String,
    totalAmount: Number,
    paid: Boolean,
    note: String,
    shippingMethod: String,
    paymentMethod: String,
    accomplish: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],

})

invoiceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Invoice', invoiceSchema)