import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import * as Actions from '../actions/Actions';
import { connect } from 'react-redux';
import { Input, Button } from 'react-bootstrap';
import FBSignIn from './FBSignIn';
import strftime from 'strftime';
const socket = io();


@connect()
export default class WelcomePage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
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
      text: '',
      typing: false
    };
  }




  componentDidMount() {
    const { actions } = this.props
    socket.on('new bc message', msg =>
    this.setState({message: [...this.state.message, msg] })
    )


  }



  handleSubmit(event) {
    const { user } = this.props;
    const text = event.target.value.trim();
    if (event.which === 13) {
      event.preventDefault();

  console.log(sample)
      socket.emit('new message', newMessage);
      UserAPIUtils.createMessage(newMessage);
      this.props.onSave(newMessage);
      this.setState({ text: '', typing: false });
      socket.emit('stop typing');
    }
  }
  handleChange(event) {
   var newMessage = {
        id: Date.now(),
        channelID: "sample",
        text: "text",
        user: "user",
        time: strftime('%H:%M %p', new Date())
      };

  this.state.message = [...this.state.message, newMessage]


    this.setState({ text: event.target.value });
    if (event.target.value.length > 0 && !this.state.typing) {
      socket.emit('typing');
      this.setState({ typing: true});
    }
    if (event.target.value.length === 0 && this.state.typing) {
      socket.emit('stop typing');
      this.setState({ typing: false});
    }
  }



  render() {

   const message  = this.state.message

    return (
      <div>
        <header style={{display: 'flex', justifyContent: 'center', flexGrow: '0', order: '0'}}>
          <p style={{fontSize: '1.5em', marginRight: '1em'}}> Socket.io Test</p>
        </header>
          <main style={{ justifyContent: 'center'}}>




                   <div style={{ width: '70em', height: '5rem', }}>
                    <Input
                      style={{  height: '100%', fontSize: '2em', }} type="textarea" autoFocus="false"
                      name="message"
                      placeholder="Type here to chat!"
                      value={this.state.text}
                      onChange={::this.handleChange}
                      onKeyDown={::this.handleSubmit}
                    />
                  </div>


                  <div style={{ width: '70em', height: '5rem', }}>
                    <Input
                      style={{  height: '100%', fontSize: '2em', }} type="textarea" autoFocus="false"
                      name="message"
                      placeholder="Type here to chat!"
                      value={this.state.text}
                      onChange={::this.handleChange}
                      onKeyDown={::this.handleSubmit}
                    />
                  </div>




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

       </main>
      </div>
    )
  }
}
