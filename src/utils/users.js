const users = [];

const addUser = ({ username, id, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check if the values are provided
  if(!username || !room) return { error: 'Username and room are required!' }

  // check for existing user in the room
  const existingUser = users.find(user => user.username === username && user.room === room);
  if(existingUser) return { error: 'Username is taken!' }

  // finally add user if it passed all other conditions
  const user = { username, id, room };
  users.push(user);
  return { user };
}

// Function to remove user
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// addUser({
//   id: 55,
//   username: 'Slaven',
//   room: 'Vogošća'
// });

// addUser({
//   id: 44,
//   username: 'Ognjen',
//   room: 'Lukavica'
// });

// addUser({
//   id: 33,
//   username: 'Mirjana',
//   room: 'Vogošća'
// });


// Function to get a user if there is one
const getUser = id => {
  const oneUser = users.find(user => user.id === id);
  if(!oneUser) return undefined;
  return oneUser;

  // return users.find(user => users.id === id);
}

// Function to get all users in one room
const getUsersInRoom = room => {
  const usersInRoom = users.filter(user => user.room === room);
  return usersInRoom;
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}