const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!,
    name: String
  }

  type Query {
    hello: String,
    getUser( id: ID ): User
    getUsers: [ User ]
  }

  type Mutation {
    addUser( name: String ): User
    updateUser( id: ID, name: String ): User
  }
`;

module.exports = typeDefs;
