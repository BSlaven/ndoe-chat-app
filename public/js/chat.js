const socket = io();

// DOM Elements
const form = document.querySelector('#form');
const formMessageInput = document.querySelector('#poruka');
const sendMessageBtn = document.querySelector('#form-btn');
const sendLocationBtn = document.querySelector('#send-location');
const messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  // get the newMessage element
  const newMessage = messages.lastElementChild;

  // get the height of the newMesage element
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // get visible height/amount of space a user can see
  const visibleHeight = messages.offsetHeight;

  // get height of the container
  const containerHeight = messages.scrollHeight;

  // how far is the scroll
  const scrollOffset = messages.scrollTop + visibleHeight;

  // ask if I have scrolled to the bottom
  if(containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
}

socket.on('message', message => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', location => {
  const html = Mustache.render(locationTemplate, {
    url: location.location,
    username: location.username,
    createdAt: moment(location.createdAt).format('h:mm a')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ users, room }) => {
  const html = Mustache.render(sidebarTemplate, {
    users,
    room
  });
  document.querySelector('#sidebar').innerHTML = html;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  sendMessageBtn.setAttribute('disabled', 'disabled');
  const message = formMessageInput.value;
  socket.emit('helloMessage', message, (error) => {
    sendMessageBtn.removeAttribute('disabled');
    formMessageInput.value = '';
    formMessageInput.focus();
    if(error) return console.log(error);
    console.log('Delivered succesfully!');
  });
});

// sendLocationBtn.addEventListener('click', () => {
//   if(!navigator.geolocation) {
//     return alert('Geolocation is not supported by your browser.');
//   }
//   sendLocationBtn.setAttribute('disabled', 'disabled');
//   navigator.geolocation.getCurrentPosition(position => {
//     const location = {
//       lat: position.coords.latitude,
//       long: position.coords.longitude
//     };
//     socket.emit('sendLocation', location, () => {
//       console.log('Location shared!');
//       sendLocationBtn.removeAttribute('disabled');
//     });
//   });
// });

socket.emit('join', { username, room }, error => {
  if(error) {
    alert(error)
    location.href = '/'
  }
  document.querySelector('#exit-btn').addEventListener('click', () => {
    location.href = '/';
  });
});