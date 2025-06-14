module.exports = (req, res, next) => {
  const { email } = req.body;
  if (!email.endsWith('@ecews.org')) {
    return res.status(403).json({ message: 'Only @ecews.org emails allowed for fallback login' });
  }
  next();
};
