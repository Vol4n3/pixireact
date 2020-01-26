const socketUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8854/' : 'https://comuty.fr/';
const script = document.createElement('script');
let socket;
script.async = true;
script.src = socketUrl + 'socket.io/socket.io.js';
document.head.appendChild(script);
const socketResolver = new Promise(resolve => {
  if (socket) {
    return resolve(socket);
  }
  script.onload = () => {
    socket = window.io(socketUrl);
    resolve(socket);
  };
});
export default socketResolver;