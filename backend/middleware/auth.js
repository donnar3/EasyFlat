// middleware/auth.js
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      // User is authenticated, proceed to the next middleware or route
      next();
    } else {
      // User is not authenticated, send a 401 response or redirect to login
      res.status(401).send({ message: 'You are not authenticated' });
    }
  };
  
  module.exports = isAuthenticated;
  