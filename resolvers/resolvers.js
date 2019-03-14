const jsonfile = require('jsonfile');
const path = require('path');

const DB_PATH = path.join(__dirname, '../users.json');

const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      return 'world';
    },
    getUser: (parent, args, context) => {
      return jsonfile.readFile(DB_PATH)
      .then(data => data.users.find(user => args.id === user.id));
    },
    getUsers: (parent, args, context) => {
      return jsonfile.readFile(DB_PATH)
      .then(data => data.users);
    },
  },
  Mutation: {
    addUser: (parent, args, context) => {
      if (!args.name) {
        return undefined;
      }
      const newUser = { name: args.name, id: `${Math.random()}` };
      return jsonfile.readFile(DB_PATH)
      .then(data => {
        const newData = { users: data.users.slice() };
        newData.users.push(newUser);
        return jsonfile.writeFile(DB_PATH, newData)
        .then(() => newUser);
      });
    },
    updateUser: (parent, args, context) => {
      if (!args.name || !args.id) {
        return undefined;
      }
      return jsonfile.readFile(DB_PATH)
      .then(data => {
        const newData = { users: data.users.slice() };
        const user = newData.users.find(user => args.id === user.id)
        user.name = args.name;
        return jsonfile.writeFile(DB_PATH, newData)
        .then(() => user);
      });
    },
  }
};

module.exports = resolvers;
