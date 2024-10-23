const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const os = require('os'); 

class Server {
  constructor(port) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.setupRoutes();
  }

  // Method to configure middleware
  configureMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    const corsOptions = {
      origin: '*',
      credentials: true,
      optionalSuccessStatus: 200
    };
    this.app.use(cors(corsOptions));
  }

  // Method to setup routes
  setupRoutes() {
    this.app.use('/', router);
  }

  // Method to start the server
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server se pokreće na: http://localhost:${this.port}`);
    });
  }
}

// Create a server instance and start it
const server = new Server(4000);
server.start();
