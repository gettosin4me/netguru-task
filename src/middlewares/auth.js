const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "'No Valid Authorization header present" });
    }

    const [_, token] = req.headers.authorization.split(' ');

    const data = await jwt.verify(token, JWT_SECRET);

    req.user = data;
    next();
  } catch (err) {
    const { name, message } = err;
    return res.status(401).json({ error: { name, message } });
  }
};
