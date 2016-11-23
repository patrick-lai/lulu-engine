import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// UI imports
import oscilloscope from 'oscilloscope';
import Time from 'react-time-format'
import annyang from 'annyang';

// Material stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import store from '../../main';

// Less styles
import './layout.less';
import './iphone.less';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Phone extends Component {

    constructor(props){
      super(props);
      this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
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

      var $this = this;

      // Time refresher per 5 seconds
      setInterval(function(){
        $this.setState({
          nowTime : new Date()
        })
      },5000);

      if (annyang) {

        // Add our commands to annyang
        annyang.addCommands({
          '*anything': function(anything) {
            // Dispatch new question
            console.log("Detected : ", anything);
            this.props.actions.newQuestion(anything);
          }.bind(this)
        });

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
      }

    }

    handleTextFieldChange(e){
      this.props.luluApi.question = e.target.value;
    }

    render() {

        return (
          <MuiThemeProvider>

            <div className="full-screen main-container text-centered">

              <div className="help_container">
                <div className="help_button">
                  HOW TO USE
                  <p className="help_section">
                    Still Work In Progress <br/>
                    <br/>
                    The idea is to make a Siri-like assistant for the game "LOL"<br/>
                    The natural language recognition cant understand LOL specific jargon.<br/>
                    Will need to find something that allows custom grammar.<br/>
                    For now just try typing these questions<br/>
                    <br/>
                    1) "What is the best build for yasuo?"<br/><br/>
                    2) "What is the best summoers for lulu?"<br/><br/>
                    3) "What champions are good against Syndra?"<br/><br/>
                    4) "What champions counter jinx?"<br/><br/>
                  </p>
                </div>
              </div>

              <div className="wrapper">

              	<div className="device_wrapper" style={{marginTop: '2em'}}>
              		<div className="device dark">
              			<div className="speaker"></div>
                      <div className="contentAreaStyle">
                        <div className="statusBarStyle">
                          <span style={{float: 'left'}}>Lulu Assistant</span> <span className="currentTime"><Time value={this.props.luluApi.nowTime} format="HH:mm" /></span> <span style={{float: 'right'}}>Bat: 100%</span>
                        </div>
                        <canvas className="visualizer" style={{width: '100%', height: '400px'}}></canvas>
                        <div className="bottomBar">
                          <p>{this.props.luluApi.response}</p>
                          <hr/>
                          <TextField
                            floatingLabelText="Type Question Here"
                            underlineFocusStyle={{borderColor: '#E55960' }}
                            style={{margin: '0 1em'}}
                            defaultValue={this.props.luluApi.question}
                            onChange={this.handleTextFieldChange}
                          />
                          <RaisedButton label="Send" onTouchTap={()=>{
                            this.props.actions.sendQuestion(this.props.luluApi.question);
                          }}/>
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

Phone.contextTypes = { store: React.PropTypes.object };

export default Phone;
