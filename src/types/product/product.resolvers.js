import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}
const product = (_, args) => {
  return Product.findById(args.id)
    .lean()
    .exec()
}
const products = () => {
  return Product.find({}).exec()
}
const newProduct = (_, args, ctx) => {
  return Product.create({ ...args.input, createdBy: ctx.user._id })
}
const updateProduct = (_, args, ctx) => {
  return Product.findByIdAndUpdate(args.id, args.input, { new: true })
    .lean()
    .exec()
}
const removeProduct = (_, args) => {
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}
export default {
  Query: {
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product, args) {
      // console.log(product)
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
