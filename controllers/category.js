const categoryRouter = require('express').Router()
const Category = require('../models/category')

categoryRouter.get('/', async (request, response) => {
    const categorys = await Category.find({})
    if(!categorys)
    {
        response.status(404).end()
    }
    response.status(200).json(categorys)
})

categoryRouter.post('/', async (request, response) => {
    try {
        const { name } = request.body;

        const newCategory = new Category({
            name,
        });
        const savedCategory = await newCategory.save();
        if (savedCategory) {
            const categories = await Category.find({})
            response.status(200).json(categories).end();
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});
module.exports = categoryRouter