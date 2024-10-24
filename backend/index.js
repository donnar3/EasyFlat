const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const authRouter = require('./routes/oauth');
const requestRouter = require('./routes/request');
const isAuthenticated = require('./middleware/auth'); // Import the middleware
const session = require('express-session');


class Server {
  constructor(port) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.setupRoutes();
  }

  configureMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    const corsOptions = {
      origin: '*',
      credentials: true,
      optionalSuccessStatus: 200
    };

    this.app.use(cors(corsOptions));

        // Session middleware configuration
        this.app.use(session({
          secret: 'your_secret_key', // Replace with a strong secret key
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 day (adjust as needed)
          }
        }));
      }
  

  setupRoutes() {
    this.app.use('/', router);
    this.app.use('/oauth', authRouter);
    this.app.use('/request', requestRouter);
    this.app.use('/protected', isAuthenticated, router);

  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server se pokreće na: http://localhost:${this.port}`);
    });
  }
}

const server = new Server(4000);
server.start();
