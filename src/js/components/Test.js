import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import * as Actions from '../actions/Actions';
import { connect } from 'react-redux';
import { Input, Button } from 'react-bootstrap';
import FBSignIn from './FBSignIn';
import strftime from 'strftime';


import { SOCKET_SERVER } from '../constants/etc.js';
const socket = io.connect(SOCKET_SERVER,{'reconnect': false })



@connect()
export default class WelcomePage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
  socket.on('socketid', msg =>
    this.setState({ mysocket_id: msg })
    )
  socket.on('connect', function () {
      socket.emit('authenticate', {token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE0NDgzNzU0MjJ9.D36z6zz-gFncPbVOdMznqXGUeDhgBsfn1sLmxJGnICk"});
    });

  }


  handleChatSubmit(event) {
    const { user } = this.props;
    const text = event.target.value.trim();
    if (event.which === 13) {
      event.preventDefault();

      var newMessage = {
        id: Date.now(),
        channelID: "sample",
        text: "text",
        user: "user",
        time: strftime('%H:%M %p', new Date())
      };
      console.log("sample")
      console.log(this.state.isocket_id)
      console.log(this.state.body)

      socket.emit('new message', newMessage, "/");
      this.setState({ body: '', typing: false });
      this.setState({ socketid: '', typing: false });
      socket.emit('stop typing');
    }
  }

 handleEmitSubmit(event) {
  console.log(this.state.isocket_id)
  console.log(this.state.emit_body)
  socket.emit('id msg',[{id: this.state.isocket_id}, {id: this.state.emit_body}]);
  this.setState({ isocket_id: '', emit_body: '' });
  }

  handleChangeBody(event) {
    this.setState({ emit_body: event.target.value });
  }
  handleChangeSocketId(event) {
    this.setState({ isocket_id: event.target.value });
  }


  handleEventEmitSubmit(event) {
  console.log(this.state.emit_event_name)
  console.log(this.state.emit_event_body)
  socket.emit(this.state.emit_event_name, this.state.emit_event_body);
  this.setState({ emit_event_name: '', emit_event_body: '' });
  }

  handleChangeEventName(event) {
    this.setState({ emit_event_name: event.target.value });
  }
  handleChangeEventBody(event) {
    this.setState({ emit_event_body: event.target.value });
  }



  handleChatBody(event) {
    this.setState({ chat_body: event.target.value });
  }




  render() {

   const message  = this.state.message
   // var clipboard = new Clipboard('.btn')

    return (
      <div>
        <header style={{display: 'flex', justifyContent: 'center', flexGrow: '0', order: '0'}}>
          <p style={{fontSize: '1.5em', marginRight: '1em'}}> Socket.io Test</p>
        </header>


              <Button bsStyle="success" onClick={::this.RestartSocket} type="submit">
              <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}} >Restart Socket </p>
              </Button>
              <Button  bsStyle="success"   >
              <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}} > My ID:  {this.state.mysocket_id} </p>
              </Button>




            <Input
              label="isocket_id"
              ref="usernameInput"
              type="text"
              style={{ width: '50%' }}
              name="username"
              placeholder="Enter socket id"
              value={this.state.isocket_id}
              onChange={::this.handleChangeSocketId}  />
            <Input
              label="emit_body"
              ref="usernameInput"
              style={{ width: '50%' }}
              type="text"
              name="username"
              placeholder="Enter body message"
              value={this.state.emit_body}
              onChange={::this.handleChangeBody} />
            <Button
              bsStyle="success"
              onClick={::this.handleEmitSubmit}
              style={{  margin: '1em' }}
              type="submit">
              <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}} >ID Emit</p>
            </Button>


              <Input
              label="emit_event_name"
              ref="usernameInput"
              type="text"
              name="username"
              placeholder="Enter event name"
              value={this.state.emit_event_name}
              onChange={::this.handleChangeEventName} />
            <Input
              label="emit_event_body"
              ref="usernameInput"
              style={{ width: '50%' }}
              type="text"
              name="username"
              placeholder="Enter emit body message"
              value={this.state.emit_event_body}
              onChange={::this.handleChangeEventBody} />
            <Button
              bsStyle="success"
              onClick={::this.handleEventEmitSubmit}
              style={{  margin: '1em' }}
              type="submit">
              <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}} >Event Emit</p>
            </Button>






 <Input style={{ marginTop: '3rem', height: '8%', fontSize: '1em',width: '80%' }} type="textarea" autoFocus="false"
                      name="message"
                      placeholder="chat box"
                      value={this.state.body}
                      onChange={::this.handleChatBody}
                      onKeyDown={::this.handleChatSubmit} />



    <section style={{height: '2em'}}>
      <ul style={{wordWrap: 'break-word', margin: '0', overflowY: 'auto', padding: '0', width: '100%', flexGrow: '1', order: '1'}} ref="messageList">
            { message.map( message =>
            <li>
              <span>
                <b style={{color: '#66c'}}>{message.channelID} </b>
                <i style={{color: '#aad', opacity: '0.8'}}>{message.user}</i>
              </span>
              <div style={{clear: 'both', paddingTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em'}}>{message.time}: {message.text}</div>
            </li>
         ) }
        </ul>
     </section>

      </div>
    )
  }




  RestartSocket() {
    // socket.disconnect(SOCKET_SERVER)
    // const socket = io.connect(SOCKET_SERVER,{'reconnect': false })
    // socket.destroy()
    socket.connect(SOCKET_SERVER,{'reconnect': false })

    socket.removeAllListeners()
    // console.log(socket)

    // socket.emit('restart')

    socket.on('socketid', msg =>
      console.log(msg)
    // this.setState({ socketid: msg })
    )


        // socket.emit('restart')

    socket.on('soc', msg =>
      console.log(msg)
    // this.setState({ socketid: msg })
    )


    socket.on('new bc message', msg =>
    this.setState({message: [...this.state.message, msg] })
    )

    socket.on('socketid', msg =>
      console.log(msg)
    // this.setState({ socketid: msg })
    )

    socket.on('test', msg =>
    console.log(msg)
    )

    socket.on('new msg', msg =>
    console.log(msg)
    )

    socket.on('gg', msg =>
    console.log(msg)
    )


     socket.emit('authenticate', {token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE0NDgzNzU0MjJ9.D36z6zz-gFncPbVOdMznqXGUeDhgBsfn1sLmxJGnICk"});

  }


  constructor(props, context) {
    super(props, context);
    this.state = {
      message: [{id: "1",
                channelID: "room1",
                text: "text1",
                user: "user1",
                time: "12:00"},

                {id: "1",
                channelID: "room2",
                text: "text2",
                user: "user2",
                time: "12:30"}],
      emit_body: '',
      chat_body: '',
      mysocket_id: '',
      isocket_id: '',
      emit_event_body: '',
      emit_event_name: '',
      typing: false
    };
  }

}