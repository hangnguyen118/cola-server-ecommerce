const shippingMethodRouter = require('express').Router()
const ShippingMethod = require('../models/shippingMethod')

shippingMethodRouter.get('/', async (request, response) => {
    const shippingMethods = await ShippingMethod.find({})
    if(!shippingMethods)
    {
        response.status(404).end()
    }
    response.status(200).json(shippingMethods)
})

shippingMethodRouter.post('/', async (request, response) => {
    try {
        const { shippingName, shippingPrice } = request.body;

        const newShippng = new ShippingMethod({
            name: shippingName,
            price: shippingPrice,
        });
        const savedShippng = await newShippng.save();
        if (savedShippng) {
            const shippingMethods = await ShippingMethod.find({})
            response.status(200).json(shippingMethods).end();
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});
module.exports = shippingMethodRouter