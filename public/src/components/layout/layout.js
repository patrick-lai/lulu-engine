import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addMessage} from '../../actions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import oscilloscope from 'oscilloscope';
import Time from 'react-time-format'
import annyang from 'annyang';
import LuluApi from '../../actions/LuluApi'

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
      },5000)

      if (annyang) {

        console.log("annnyang did render");

        // Add our commands to annyang
        annyang.addCommands({
          '*anything': function(anything) {
            console.log(luluApi);
            console.log(anything);
            luluApi.sendQuestion(anything, (response)=>{
              $this.setState({
                response: response.text,
                responseData: response.data
              })
              console.log("responded",response);
            })
          }
        });

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
      }

    }

    render() {

        const contentAreaStyle = {
          backgroundColor: '#2A2B2A',
          height: '60vh',
          width: '100%',
          position: 'relative'
        };

        const recordButtonStyle = {
          bottom: '0',
          position: 'absolute',
          padding: '1em 0',
          width: '100%'
        };

        const statusBarStyle = {
          backgroundColor: 'rgba(255,255,255,0.06)',
          fontFamily: 'arial',
          textAlign: 'center',
          padding: '0 .5em'
        }

        return (
            <div className="full-screen main-container text-centered">
              <div className="wrapper">

              	<div className="device_wrapper" style={{marginTop: '2em'}}>
              		<div className="device dark">
              			<div className="speaker"></div>
                      <div style={contentAreaStyle}>
                        <div style={statusBarStyle}>
                          <span style={{float: 'left'}}>Carrier</span> <span className="currentTime"><Time value={this.state.nowTime} format="HH:mm" /></span> <span style={{float: 'right'}}>Bat: 100%</span>
                        </div>
                        <canvas className="visualizer" style={{width: '100%', height: '500px'}}></canvas>
                        <div style={recordButtonStyle}>
                          {this.state.response}
                        </div>
                      </div>
              		</div>
              	</div>
              </div>

              <div className="author">Created by - Patrick Lai</div>
            </div>
        );
    }
}

Layout.propTypes = {
    actions: PropTypes.object.isRequired,
    addmessage: PropTypes.object
};

export default Layout;
