const jsonfile = require('jsonfile');
const path = require('path');
const resolvers = require('./resolvers');

const DB_PATH = path.join(__dirname, '../users.json');

jest.mock('jsonfile', () => {
  const data = {
    users: [
      {
        id: '123',
        name: 'Or',
      },
      {
        id: '1234',
        name: 'John',
      },
    ]
  };
  return {
    readFile: jest.fn(() => Promise.resolve(data)),
    writeFile: jest.fn(() => Promise.resolve(data)),
  };
});

const usersData = [
  {
    id: '123',
    name: 'Or',
  },
  {
    id: '1234',
    name: 'John',
  },
];

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe('resolvers', () => {
  beforeEach(() => {
    jsonfile.readFile.mock.calls = [];
    jsonfile.writeFile.mock.calls = [];
  });

  describe('Queries resolvers', () => {
    it('hello resolver should return "world" string', () => {
      const result = resolvers.Query.hello();

      expect(result).toEqual('world');
    });

    describe('getUser resolver', () => {
      it('should return undefined when called without an id', () => {
        return resolvers.Query.getUser(null, {})
        .then((result) => {
          expect(result).toEqual(undefined);
        });
      });

      it('should call jsonfile.readFile and return User data with the id it received', () => {
        return resolvers.Query.getUser(null, { id: '123' })
        .then((result) => {
          expect(jsonfile.readFile.mock.calls).toEqual([[DB_PATH]]);
          expect(result).toEqual({
            id: '123',
            name: 'Or',
          });
        });
      });
    });

    describe('getUsers resolver', () => {
      it('should call jsonfile.readFile and return all the Users data', () => {
        return resolvers.Query.getUsers()
        .then((result) => {
          expect(jsonfile.readFile.mock.calls).toEqual([[DB_PATH]]);
          expect(result).toEqual(usersData);
        });
      });
    });
  });

  describe('Mutations resolvers', () => {
    describe('addUser resolver', () => {
      it('should call create a new user with the name it received', () => {
        const newUser = { name: 'Bob', id: `${Math.random()}` };
        const newUsersData = usersData.slice();
        newUsersData.push(newUser);

        return resolvers.Mutation.addUser(null, { name: 'Bob' })
        .then((result) => {
          expect(jsonfile.readFile.mock.calls).toEqual([[DB_PATH]]);
          expect(jsonfile.writeFile.mock.calls).toEqual([[DB_PATH, { users: newUsersData }]]);
          expect(result).toEqual(newUser);
        });
      });

      it('should return undefined when called without a name', () => {
        const result = resolvers.Mutation.addUser(null, {});

        expect(result).toEqual(undefined);
      });
    });

    describe('updateUser resolver', () => {
      it('should call create a new user with the name it received', () => {
        const args = { id: '123', name: 'Bob' };
        const newData = { users: usersData.slice() };
        const user = newData.users.find(user => args.id === user.id)
        user.name = args.name;

        return resolvers.Mutation.updateUser(null, args)
        .then((result) => {
          expect(jsonfile.readFile.mock.calls).toEqual([[DB_PATH]]);
          expect(jsonfile.writeFile.mock.calls).toEqual([[DB_PATH, newData]]);
          expect(result).toEqual(user);
        });
      });

      it('should return undefined when called without a name', () => {
        const result = resolvers.Mutation.updateUser(null, { id: '123' });

        expect(result).toEqual(undefined);
      });

      it('should return undefined when called without an id', () => {
        const result = resolvers.Mutation.updateUser(null, { name: 'Bob' });

        expect(result).toEqual(undefined);
      });
    });
  });
});
