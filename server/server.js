const express = require('express');
const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes');

//import ApolloServer
const { ApolloServer } = require("apollo-server-express");

//import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./Schemas");
const { authMiddleWare } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

//create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare
})

//integrate our Apollo server with the Express application as middleware
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  //app.use(routes);
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      //log where we can go to test our DQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

//call the async function to start the server
startApolloServer();
