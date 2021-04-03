let userName = '';

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();

// LISTENERS //
socket.on('message', ({ author, content }) => addMessage(author, content));

// LOGIN //

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  login();
  socket.emit('login', userName)
});

function login() {
  const loginValue = userNameInput.value;

  if (loginValue) {
    userName = loginValue;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else {
    window.alert('You should enter your name first');
  }
};

// MESSAGES //

addMessageForm.addEventListener('submit', function(event) {
  event.preventDefault();
  sendMessage(userName, messageContentInput.value)
})

function sendMessage (userName, textField) {
  if (textField) {
    addMessage(userName, textField);
    socket.emit('message', {author: userName, content: textField});
    messageContentInput.value = ''
  } else {
    window.alert('Please type your message')
  }
}

function addMessage(author, content) {
  const message = document.createElement('li');

  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) message.classList.add('message--self');
  if (author == 'Chat Bot') message.classList.add('message--bot');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">${content}</div>
  `;
  messagesList.appendChild(message);
};