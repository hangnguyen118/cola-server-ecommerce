const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
const password = process.argv[2]

const url =
  `mongodb+srv://colaapp:${password}@atlascluster.atdawmn.mongodb.net/colaApp?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    categoriesName: String,
    image: String,
    total: Number,
    describe: String,
    isActive: Boolean,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Product', productSchema)