import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addMessage} from '../../actions';
import Recorder from '../recorder/recorder.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import oscilloscope from 'oscilloscope';

import './layout.less';
import './iphone.less';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Layout extends Component {

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
          font: 'arial'
        }

        return (
          <MuiThemeProvider>
            <div className="full-screen main-container text-centered">
              <div className="wrapper">
              	<div className="device_wrapper">
              		<div className="device dark">
              			<div className="speaker"></div>
                      <div style={contentAreaStyle}>
                        <div style={statusBarStyle}>
                          Carrier 4:20PM Battery
                        </div>
                        <canvas className="visualizer" style={{width: '100%', height: '500px'}}></canvas>
                        <div style={recordButtonStyle}>
                          <RaisedButton label="Speak" style={{margin: '0 auto'}} />
                        </div>
                      </div>
              		</div>
              	</div>
              </div>

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
