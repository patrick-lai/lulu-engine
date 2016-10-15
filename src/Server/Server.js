'use strict'

import express from 'express';
import path from 'path';

class Server {

  constructor(app){
    this.PORT = process.env.PORT || 8445;
    // Starting our webserver and putting it all together
    this.app = app;
  }

  // Begins serving enough for facebook chat bot
  serve(){
    this.app.use("/assets", express.static(path.join(__dirname, 'dist/public/assets')));

    this.app.get('/', function(req,res) {
      res.sendFile('public/index.html');
    });

    this.app.listen(this.PORT);
    console.log('Listening on :' + this.PORT + '...');
  }

}

export default Server;
