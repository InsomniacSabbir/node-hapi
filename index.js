const mongoose = require("mongoose");
const Painting = require("./models/Painting");
const schema = require("./graphql/schema");

const { ApolloServer, gql } = require("apollo-server-hapi");
const Hapi = require("hapi");

const insertIntoDB = (root, args) => {
  console.log(args);
  const painting = new Painting(args.payload);
  return painting.save();
};

const getFromDB = (req, res) => {
  return Painting.find();
};

const resolvers = {
  Query: {
        paintings: getFromDB ,
    },
  Mutation: {
    savePainting: insertIntoDB,
  }
  };

let typeDefs = [schema];

async function StartServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const app = new Hapi.server({
    port: 4000
  });
  mongoose.connect("mongodb://dba:root1234@ds229468.mlab.com:29468/node-api");

  mongoose.connection.once("open", () => {
    console.log("Connected to db");
  });
  await app.route([
    {
      method: "GET",
      path: "/",
      handler: () => {
        return "<h1>Hello World</h1>";
      }
    },
    {
      method: "GET",
      path: "/api/v1/paintings",
      handler: getFromDB
    },
    {
      method: "POST",
      path: "/api/v1/paintings",
      handler: insertIntoDB
    }
  ]);
  await server.applyMiddleware({
    app
  });
  await server.installSubscriptionHandlers(app.listener);
  await app.start();
}

StartServer().catch(error => console.log(error));
// console.log(schema);

// const { apolloHapi, graphiqlHapi } = require('apollo-server-hapi');
// const { makeExecutableSchema } = require('graphql-tools');

// const server = hapi.server({
//     host: "localhost",
//     port: 4000,
// });

// const insertIntoDB = (req, res) => {
//     const {name, url, techniques} = req.payload;
//     const painting = new Painting({
//         name, url, techniques,
//     });
//     return painting.save();
// };

// const getFromDB = (req, res) => {
//     return Painting.find();
// };

// let resolvers = [getFromDB, insertIntoDB];

// let typeDefs = [schema];

// const init = async () => {

//     await server.route([
//         {
//             method: 'GET',
//             path: '/',
//             handler: () => {
//                 return '<h1>Hello World</h1>'
//             }
//         },
//         {
//             method: 'GET',
//             path: '/api/v1/paintings',
//             handler: getFromDB,
//         },
//         {
//             method: 'POST',
//             path: '/api/v1/paintings',
//             handler: insertIntoDB,
//         }
//     ]);
//     await server.start();
//     console.log(`server running at ${server.info.uri}`);
// };

// mongoose.connect("mongodb://dba:root1234@ds229468.mlab.com:29468/node-api");

// mongoose.connection.once('open', () => {
//     console.log('Connected to db');
// });

// init().catch(err => {
//     console.err(err);
// }) ;
