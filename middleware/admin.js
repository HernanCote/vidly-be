admin = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send('User is not authorized to access this feature');
  }
  next();
};

module.exports = admin;
