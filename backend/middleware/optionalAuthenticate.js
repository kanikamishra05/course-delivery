const jwt = require('jsonwebtoken');

// Like authenticate, but does not return 401 if no token is present.
// If a valid token exists, req.user is populated.
// If no token or invalid token, req.user remains undefined and the request continues.
const optionalAuthenticate = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(); // no token — proceed as unauthenticated
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
  } catch {
    // Invalid/expired token — treat as unauthenticated
  }

  next();
};

module.exports = optionalAuthenticate;
