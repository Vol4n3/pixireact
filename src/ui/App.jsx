import React from 'react';
import socketResolver from '../socket/socket';

export default class App extends React.PureComponent {
  componentDidMount() {
    socketResolver.then(socket=>{
      console.log('app');
      socket.on('co',(data)=>{

      });
    });
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}
