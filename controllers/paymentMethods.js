const paymentMethodsRouter = require('express').Router()
const PaymentMethods = require('../models/paymentMethods')

paymentMethodsRouter.get('/', async (request, response) => {
    const paymentMethods = await PaymentMethods.find({})
    if(!paymentMethods)
    {
        response.status(404).end()
    }
    response.status(200).json(paymentMethods)
})

paymentMethodsRouter.post('/', async (request, response) => {
    try {
        const { name } = request.body;

        const newPaymentMethods = new PaymentMethods({
            name,
        });
        const savedPaymentMethods = await newPaymentMethods.save();
        if (savedPaymentMethods) {
            const paymentMethods = await PaymentMethods.find({})
            response.status(200).json(paymentMethods).end();
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});
module.exports = paymentMethodsRouter