const productsRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/user')
const multer = require('multer');
const fs = require('fs');


const upload = multer({ dest: 'images/' });

productsRouter.get('/', async (request, response) => {
    const products = await Product.find({})
    response.status(200).json(products)
})

productsRouter.get('/:id', (request, response) => {
  Product.findById(request.params.id).then(product => {
    if (product) {
      response.json(product)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

productsRouter.post('/', upload.single('image'), async (request, response) => {
  const imagePath = request.file.path;
  const body = request.body;
  const user = await User.findById(body.userId);
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }
  const product = new Product({
    name: body.name,
    price: body.price,
    categoriesName: body.categoriesName,
    image: imagePath,
    total: 0,
    describe: body.describe,
    isActive: true,
    user: body.userId,
  });

  const saveProduct = await product.save();

  if (saveProduct) {
    user.products = user.products.concat(saveProduct._id);
    await user.save();
    response.status(201).json(saveProduct);
  } else {
    response.status(500).json({ error: 'Failed to save the product' });
  }
});

productsRouter.put('/:id', upload.single('image'), (request, response) => {
  const body = request.body
  let product;
  if(request.file){
    const imagePath = request.file.path;
      product = {
      name: body.name,
      price: body.price,
      categoriesName: body.categoriesName,
      image: imagePath,
      describe: body.describe,
      isActive: body.isActive,
    }
  }else{
    product = {
      name: body.name,
      price: body.price,
      categoriesName: body.categoriesName,
      describe: body.describe,
      isActive: body.isActive,
    }
  } 
  Product.findByIdAndUpdate(request.params.id, product, { new: true }).then( updateProduct => {
      response.status(201).json(updateProduct)
    })
    .catch(error => {
      console.log(error)
      response.status(400).end()
    })
})

productsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return response.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    await Product.findByIdAndRemove(id);

    fs.unlink(product.image, (err) => {
      if (err) {
        console.error('Lỗi khi xóa hình ảnh:', err);
      }
    });
    response.status(200).json({ message: 'Đã xóa thành công' });
  } catch (err) {
    response.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
});

// productsRouter.patch('/:id', async (request, response) => {
//   const { id } = request.params
//   const { state } = request.body
//   try{
//     const product = await Product.findById(id);
//     if (!product) {
//       return response.status(404).json({ error: 'Không tìm thấy sản phẩm' });
//     }
//     product.isActive = state
//     const savedProduct = await product.save();    
//     response.status(201).json(savedProduct);
//   } catch (error) {
//     response.status(500).json({ message: 'Server error' });
// }
// })
module.exports = productsRouter  