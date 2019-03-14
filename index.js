const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema');
const resolvers = require('./resolvers/resolvers');

const port = process.env.PORT || '4000';

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the user token from the headers
    // const token = req.headers.authorization || '';

    // try to retrieve a user with the token
    // const user = getUser(token);

    // add the user to the context
    return { user: { name: 'Or' } };
  },
});

const app = express();
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, './public')));

apollo.applyMiddleware({ app });

const server = http.createServer(app);

server.listen({ port: port }, () => {
    console.log(
      '🚀 Server ready at',
      `http://localhost:${port}${apollo.graphqlPath}`
    );
  }
);
