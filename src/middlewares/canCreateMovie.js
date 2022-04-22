const jwt = require("jsonwebtoken");
const MoviesDataAccess = require('../data-access/movie');
const { SUBSCRIPTION, BASIC_MAXIMUM_MOVIE } = require('../constants');

module.exports = async (req, res, next) => {
  try {
    if(req.user.role.toUpperCase() === SUBSCRIPTION.PREMIUM) {
        next();
    }

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const countTotalMovie = await MoviesDataAccess.countTotalMovieCreated({ user_id: req.user.userId, firstDay, lastDay });

    if(countTotalMovie > BASIC_MAXIMUM_MOVIE) {
        return res.status(401).json({ error: { message: 'You have exhausted monthly quota' } });
    }
    next();
  } catch (err) {
    const { name, message } = err;
    return res.status(401).json({ error: { name, message } });
  }
};
