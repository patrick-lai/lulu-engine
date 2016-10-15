'use strict'
// ----------------------------------------------------------------------------
// Messenger API specific code

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference

import Config from '../config';
import bodyParser from'body-parser';
import crypto from 'crypto';
import fetch from 'node-fetch';
import request from 'request';

class FbChatBot {
  constructor(app, wit){
    this.app = app;

    // This will contain all user sessions.
    // Each session has an entry:
    // sessionId -> {fbid: facebookUserId, context: sessionState}
    this.sessions = {};
    this.wit = wit;
  }

  /*
  * Verify that the callback came from Facebook. Using the App Secret from
  * the App Dashboard, we can verify the signature that is sent with each
  * callback in the x-hub-signature field, located in the header.
  *
  * https://developers.facebook.com/docs/graph-api/webhooks#setup
  *
  */
  verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
      // For testing, let's log an error. In production, you should throw an
      // error.
      console.error("Couldn't validate the signature.");
    } else {
      var elements = signature.split('=');
      var method = elements[0];
      var signatureHash = elements[1];

      var expectedHash = crypto.createHmac('sha1', Config.FB_APP_SECRET)
      .update(buf)
      .digest('hex');

      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }

  setUpWebhook(){

    this.app.use(({method, url}, rsp, next) => {
      rsp.on('finish', () => {
        console.log(`${rsp.statusCode} ${method} ${url}`);
      });
      next();
    });

    this.app.use(bodyParser.json({ verify: this.verifyRequestSignature }));

    // Webhook setup
    this.app.get('/webhook', (req, res) => {
      if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
      } else {
        res.sendStatus(400);
      }
    });

    // Message handler
    this.app.post('/webhook', (req, res) => {
      // Parse the Messenger payload
      // See the Webhook reference
      // https://developers.facebook.com/docs/messenger-platform/webhook-reference
      const data = req.body;

      if (data.object === 'page') {
        data.entry.forEach(entry => {
          entry.messaging.forEach(event => {
            if (event.message && !event.message.is_echo) {
              // Yay! We got a new message!
              // We retrieve the Facebook user ID of the sender
              const sender = event.sender.id;

              // We retrieve the user's current session, or create one if it doesn't exist
              // This is needed for our bot to figure out the conversation history
              const sessionId = this.findOrCreateSession(sender);

              // We retrieve the message content
              const {text, attachments} = event.message;

              if (attachments) {
                // We received an attachment
                // Let's reply with an automatic message
                this.fbMessage(sender, 'Sorry I can only process text messages for now.')
                .catch(console.error);
              } else if (text) {
                // We received a text message

                // Let's forward the message to the Wit.ai Bot Engine
                // This will run all actions until our bot has nothing left to do
                this.wit.runActions(
                  sessionId, // the user's current session
                  text, // the user's message
                  this.sessions[sessionId].context // the user's current session state
                ).then((context) => {
                  // Our bot did everything it has to do.
                  // Now it's waiting for further messages to proceed.

                  // Send the message back to the user
                  this.fbMessage(sender,context.text);

                  console.log('Waiting for next user messages');

                  // Based on the session state, you might want to reset the session.
                  // This depends heavily on the business logic of your bot.
                  // Example:
                  // if (context['done']) {
                  //   delete sessions[sessionId];
                  // }

                  // Updating the user's current session state
                  this.sessions[sessionId].context = context;
                })
                .catch((err) => {
                  console.error('Oops! Got an error from Wit: ', err.stack || err);
                })
              }
            } else {
              console.log('received event', JSON.stringify(event));

            }
          });
        });
      }
      res.sendStatus(200);
    });
  }

  fbMessage(id, text){
    const body = JSON.stringify({
      recipient: { id },
      message: { text },
    });
    const qs = 'access_token=' + encodeURIComponent(Config.FB_PAGE_TOKEN);
    return fetch('https://graph.facebook.com/me/messages?' + qs, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body,
    })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    });
  };

  findOrCreateSession(fbid){
    let sessionId;
    // Let's see if we already have a session for the user fbid
    Object.keys(this.sessions).forEach(k => {
      if (this.sessions[k].fbid === fbid) {
        // Yep, got it!
        sessionId = k;
      }
    });
    if (!sessionId) {
      // No session found for user fbid, let's create a new one
      sessionId = new Date().toISOString();
      this.sessions[sessionId] = {fbid: fbid, context: {}};
    }
    return sessionId;
  };
}

export default FbChatBot;
