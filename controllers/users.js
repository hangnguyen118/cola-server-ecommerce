const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
require('dotenv').config()

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('products', { name: 1, price: 1, categoriesName: 1, image: 1, total: 1, describe: 1, isActive:1 })
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, email, password, phoneNumber, location } = request.body
    const user = await User.findOne({ username })
    if(user){
        return response.status(401).json({ error: 'email already exists' });
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const isAdmin = false;
    const newAccount = new User({
        username,
        name,
        email,
        isAdmin,
        location,
        passwordHash,
        phoneNumber,
    })

    const saveUser = await newAccount.save()
    response.status(201).json(saveUser)
})

userRouter.patch('/', async (request, response) => {
    const { username, isAdmin} = request.body

    const user = await User.findOne({ username })
    if(user){
        user.isAdmin = isAdmin
        await user.save()
        const users = await User.find({})
        response.status(200).json(users)
    }
    response.status(500).end()
})

userRouter.patch('/edit', async (request, response) => {
    const { userId, userName, userEmail, userPassword, userLocation, userPhoneNumber } = request.body
    const user = await User.findById(userId).populate('name username email passwordHash phoneNumber location');  
    if (!user) {
        return response.status(404).json({ error: 'user not found' });
      }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(userPassword, saltRounds)

    user.name = userName
    user.username = userEmail
    user.email = userEmail
    user.passwordHash = passwordHash
    user.phoneNumber = userPhoneNumber
    user.location = userLocation
    await user.save()
    response.status(200).json(user)
})

userRouter.get('/:userId/favorite', async (request, response) => {
    const { userId } = request.params;
    try {
        const user = await User.findById(userId).populate('favorite', 'id name price image categoriesName');
        response.status(200).json(user.favorite)
    } catch (error) {
        response.status(500).json({ message: 'Server error' });
    }
});

userRouter.post('/:userId/favorite', async (request, response) => {
    const userId = request.params.userId;
    const productId = request.body.productId;  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return response.status(404).json({ error: 'Không tìm thấy user' });
      }
      const isProductInFavorite = user.favorite.includes(productId);  
      if (isProductInFavorite) {
        user.favorite = user.favorite.filter((favProductId) => favProductId.toString() !== productId.toString());
        const saveUser = await user.save()
        return response.status(202).json(saveUser)
      }  
      user.favorite.push(productId);
      await user.save();
      const saveUser = await user.save()
      response.status(200).json(saveUser);
    } catch (error) {
      response.status(500).json({ error: 'Server error' });
    }

  });


module.exports = userRouter