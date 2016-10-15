'use strict'

import request from 'request';
import bodyParser from'body-parser';
import Util from '../Utilities/Util';

class Api {
  constructor(app, wit){
    this.app = app;
    this.wit = wit;
    // sessionId -> {fbid: facebookUserId, context: sessionState}
    this.sessions = {};
  }

  setupApi(){
    var $this = this;

    this.app.post('/question', bodyParser.json(), function(req, res){
      const question = req.body.question;

      const sessionId = Util.findOrCreateSession($this.sessions,req.body.session);

      $this.wit.runActions(
        sessionId,
        question, // the user's message
        $this.sessions[sessionId].context // the user's current session state
      ).then((context) => {
        // Updating the user's current session state
        $this.sessions[sessionId].context = context;
        // Send back
        res.json(context);
      })
      .catch((err) => {
        console.error('Oops! Got an error from Wit: ', err.stack || err);
      })
    });
  }
}

export default Api;
