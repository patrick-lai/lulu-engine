import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layout from '../components/layout/layout';
import {addMessage} from '../actions';

class App extends Component {
  render(){
    return (
      <div>
        <Layout actions={this.props.actions} addmessage={this.props.addmessage}  />
      </div>
    );
  }
}

App.propTypes = {
  // action
  actions: PropTypes.object.isRequired,
  addmessage: PropTypes.object
};

function mapStateToProps(state) {
    return {addmessage: state.addmessage};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            addMessage
        }, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Layout);
