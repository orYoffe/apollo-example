import React, { Component } from 'react';
import gql from 'graphql-tag';
import client from './apolloClient';

const GET_USERS = gql`
  query {
    getUsers {
      id
      name
    }
  }
`;
const GET_USER_BY_ID = gql`
  query ( $id: ID ) {
    getUser ( id: $id )  {
      id
      name
    }
  }
`;
const ADD_USER = gql`
  mutation addUser( $name: String ) {
    addUser ( name: $name ) {
      id
      name
    }
  }
`;
const UPDATE_USER = gql`
  mutation updateUser( $name: String, $id: ID ) {
    updateUser ( name: $name, id: $id ) {
      id
      name
    }
  }
`;

class App extends Component {
  state = {
    users: [],
    getUser: null,
    newUser: null,
    updatedUser: null,
  }

  componentDidMount() {
    this.getUser('123');

    this.addUser('Rick');
    this.addUser('Jane');

    this.updateUser('1234', 'Marry');

    this.getAllUsers();
  }

  getUser = (id) => {
    client.query({ query: GET_USER_BY_ID, variables: { id } })
    .then(result => {
      this.setState({ getUser: result.data.getUser })
    });
  }

  getAllUsers = () => {
    client.query({ query: GET_USERS })
    .then(result => {
      this.setState({ users: result.data.getUsers })
    });
  }

  addUser = (name) => {
    client.mutate({ mutation: ADD_USER, variables: { name } })
    .then(result => {
      this.setState({ newUser: result.data.addUser });

      this.getAllUsers();
    });
  }

  updateUser = (id, name) => {
    client.mutate({ mutation: UPDATE_USER, variables: { id, name } })
    .then(result => {
      this.setState({ updatedUser: result.data.updateUser });

      this.getAllUsers();
    });
  }


  render() {
    const { users, newUser, updatedUser, getUser } = this.state;

    return (
      <div className="App">
        <h1>getUsers:</h1>
        {users && users.map((user, index) => (
          <div key={`${user.id}_userItem_${index}`}>
            <p>User ID: {user.id}</p>
            <p>User Name: {user.name}</p>
            <hr />
          </div>
        ))}
        {getUser && (
          <div>
            <h1>getUser:</h1>
            <p>getUser ID: {getUser.id}</p>
            <p>getUser Name: {getUser.name}</p>
            <hr />
          </div>
        )}
        {newUser && (
          <div>
            <h1>newUser:</h1>
            <p>newUser ID: {newUser.id}</p>
            <p>newUser Name: {newUser.name}</p>
            <hr />
          </div>
        )}
        {updatedUser && (
          <div>
            <h1>updatedUser:</h1>
            <p>updatedUser ID: {updatedUser.id}</p>
            <p>updatedUser Name: {updatedUser.name}</p>
            <hr />
          </div>
        )}
      </div>
    );
  }
}

export default App;
