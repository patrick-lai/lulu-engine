import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addMessage} from '../../actions';
import oscilloscope from 'oscilloscope';
import Time from 'react-time-format'
import annyang from 'annyang';
import LuluApi from '../../actions/LuluApi'

// Material stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// Less styles
import './layout.less';
import './iphone.less';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Setup luluApi instance
var luluApi = new LuluApi();

class Layout extends Component {

    constructor() {
      super();
      this.state = {
        nowTime: new Date(),
        response: "Please ask me a question about league of legends"
      };

      this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
      this.handleSend = this.handleSend.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount(){
      var context = new window.AudioContext()
      // setup canvas
      var canvas = document.querySelector('.visualizer');

      var options = {
        stroke: 3,    // size of the wave
        glow: 0.1,    // glowing effect
        buffer: 1024  // buffer size ranging from 32 to 2048
      }

      // attach oscilloscope
      var scope = new oscilloscope(canvas, options)

      // get user microphone
      var constraints = { video: false, audio: true };
      navigator.getUserMedia(constraints, function(stream) {
        var source = context.createMediaStreamSource(stream)
        scope.addSignal(source, '#E55960')
      }, function (error) {
        console.error("getUserMedia error:", error);
      });

      // Time refresher per 5 seconds
      var $this = this;

      setInterval(function(){
        $this.setState({
          nowTime : new Date()
        })
      },5000);

      if (annyang) {

        console.log("annnyang did render");

        // Add our commands to annyang
        annyang.addCommands({
          '*anything': function(anything) {
            $this.setState({
                question: anything
            });

            luluApi.sendQuestion(anything, $this.handleResponse);
          }
        });

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
      }

    }

    handleResponse(response){
      this.setState({
        response: response.text,
        responseData: response.data
      })

      annyang.stop();
      setTimeout(function(){
        annyang.start();
      },3000);

    }

    handleTextFieldChange(e){
      this.setState({
          question: e.target.value
      });
    }

    handleSend(e){
      luluApi.sendQuestion(this.state.question, this.handleResponse);
    }

    render() {

        const contentAreaStyle = {
          backgroundColor: '#2A2B2A',
          height: '60vh',
          width: '100%',
          position: 'relative'
        };

        const statusBarStyle = {
          backgroundColor: 'rgba(255,255,255,0.06)',
          fontFamily: 'arial',
          textAlign: 'center',
          padding: '0 .5em'
        }

        return (
          <MuiThemeProvider>
            <div className="full-screen main-container text-centered">
              <div className="wrapper">

              	<div className="device_wrapper" style={{marginTop: '2em'}}>
              		<div className="device dark">
              			<div className="speaker"></div>
                      <div style={contentAreaStyle}>
                        <div style={statusBarStyle}>
                          <span style={{float: 'left'}}>Lulu Assistant</span> <span className="currentTime"><Time value={this.state.nowTime} format="HH:mm" /></span> <span style={{float: 'right'}}>Bat: 100%</span>
                        </div>
                        <canvas className="visualizer" style={{width: '100%', height: '400px'}}></canvas>
                        <div className="bottomBar">
                          <p>{this.state.response}</p>
                          <hr/>
                          <TextField
                            floatingLabelText="Type Question Here"
                            underlineFocusStyle={{borderColor: '#E55960' }}
                            style={{margin: '0 1em'}}
                            onChange={this.handleTextFieldChange}
                          />
                          <RaisedButton label="Send" onTouchTap={this.handleSend}/>
                        </div>
                      </div>
              		</div>
              	</div>
              </div>

              <div className="author">Created by - Patrick Lai</div>
            </div>
          </MuiThemeProvider>
        );
    }
}

Layout.propTypes = {
    actions: PropTypes.object.isRequired,
    addmessage: PropTypes.object
};

export default Layout;
