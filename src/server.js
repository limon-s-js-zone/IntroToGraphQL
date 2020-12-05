import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
  interface Animal{
    species:String!
    location:String!
  }
  type Tiger implements Animal{
    species:String!
    location:String!
    stripe:Int
  }
  type Lion implements Animal{
    species:String!
    location:String!
    mainColor:String!
  }
  type Cat{
    owner:Owner!
    name:String!
    age:Int
  }
  type Owner{
    name:String!
    cat:Cat!

  }
  type Query{
    cat(name:String!):Cat!
    owner(name:String!):Owner
    animal:[Animal]! 
  }
    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        animal() {
          return [
            { species: 'Lion', mainColor: 'Red', location: 'South' },
            { species: 'Tiger', stripe: 5, location: 'Bangladesh' }
          ]
        },
        cat(_, args) {
          console.log('in cat resolver')
          return {}
        },
        owner(_, args) {
          console.log('in owner resolver')
          return {}
        }
      },
      Animal: {
        __resolveType(animal) {
          return animal.species
        }
      },
      Cat: {
        name() {
          console.log('in cat Name')
          return 'Pussy'
        },
        age() {
          console.log('in cat Age')
          return 3
        },
        owner() {
          console.log('in cat Owner')
          return {}
        }
      },
      Owner: {
        name() {
          console.log('in Owner Name')
          return 'Limon'
        },
        cat() {
          console.log('in Owner Cat')
          return {}
        }
      }
    },
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
