const createMessage = (text, username) => {
  return {
    text,
    username,
    createdAt: new Date().getTime()
  }
}

const generateLocationMessage = (location, username) => {
  return {
    location,
    username,
    createtAt: new Date().getTime()
  }
}

module.exports = {
  createMessage,
  generateLocationMessage
}