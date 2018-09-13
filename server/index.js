const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const Artwork = mongoose.model('Artwork', {
  title: String,
  price: Number,
  sold: Boolean
});

const Collection = mongoose.model('Collection', {
  title: String,
  // artworks: [Artwork],
  artworks: [String]
});

const typeDefs = `
  type Query {
    hello: String
    artworks: [Artwork]
  }
  type Artwork {
    id: ID!
    title: String!
    price: Int!
    sold: Boolean!
  }
  type Mutation {
    createArtwork(title: String!): Artwork
    
    updateArtwork(id: ID!, title: String, price: Int): Boolean
    
    sellArtwork(id: ID!, sold: Boolean): Boolean

    removeArtwork(id: ID!): Boolean
  }
  `;
// createCollection(title: String!, artworks: [Artwork]): [Artwork]

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    artworks: () => Artwork.find()
  },
  Mutation: {
    createArtwork: async (_, { title }) => {
      const artwork = new Artwork({ title, price: 0, sold: false });
      await artwork.save();
      return artwork;
    },
    updateArtwork: async (_, { id, title, price }) => {
      await Artwork.findOneAndUpdate(id, { title, price });
      return true;
    },
    sellArtwork: async (_, { id, sold }) => {
      await Artwork.findOneAndUpdate(id, { sold });
      return true;
    },
    removeArtwork: async (_, { id }) => {
      await Artwork.findOneAndRemove(id);
      return true;
    }

    // createCollection: async (_, { title }) => {
    //   const collection = new Collection({ title, artworks: '' });
    //   await collection.save();
    //   return collection;
    // },
    // updateCollection: async (_, { id, title, artworks }) => {
    //   await Collection.findOneAndUpdate(id, { title, price });
    //   return true;
    // },
    // removeCollection: async (_, { id }) => {
    //   await Collection.findOneAndRemove(id);
    //   return true;
    // }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  server.start(() => console.log('Server is running on localhost:4000'));
});
