module.exports = function validateEmailDomain(req, res, next) {
  const email = req.body.email;
  if (!email.endsWith('@ecews.org')) {
    return res.status(403).json({ message: 'Email must be from @ecews.org domain' });
  }
  next();
};