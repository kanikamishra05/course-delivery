const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
        code: 'FORBIDDEN'
      });
    }
    next();
  };
};

module.exports = authorize;
