const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { authFactory, AuthError } = require("./auth");
const config = require('./config');

const AuthMiddleware = require('./middlewares/auth');
const CanCreateMovieMiddleware = require('./middlewares/canCreateMovie');
const { getMovieByTitle } = require('./caller/omdb');
const databaseProvider = require('./providers/database');

const { ERRORS } = require('./constants');

const MovieDataAccess = require('./data-access/movie');

const PORT = 3000;
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

const auth = authFactory(JWT_SECRET);
const app = express();

(async () => {
  await databaseProvider.start(mongoose, { config });
})();

app.use(bodyParser.json());

app.post("/auth", (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid payload" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "invalid payload" });
  }

  try {
    const token = auth(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

app.post("/movies", AuthMiddleware, CanCreateMovieMiddleware, async (req, res, next) => {
  if (!req?.body?.title) {
    return res.status(422).json({ error: "title is required" });
  }

  const { title: requestTitle } = req.body;

  try {
    const data = await getMovieByTitle({ title: requestTitle });

    if(data.Response === 'False') {
      return res.status(404).json({ error: ERRORS.MOVIE_NOT_FOUND });
    }

    const { Title: title, Released: released, Director: director, Genre: genre } = data;
    const movieExists = await MovieDataAccess.movieExists({ title, released, director });

    if(!movieExists) {
      await MovieDataAccess.create({
        title,
        released,
        director,
        genre,
        created_by: req.user.userId
      })
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: ERRORS.MOVIE_ERROR });
  }
});

app.get('/movies', AuthMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = parseInt(
      parseInt(limit) * parseInt(page) - parseInt(limit)
    );

    const data = await MovieDataAccess.getAll({ offset, limit });

    return res.status(200).json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`auth svc running at port ${PORT}`);
});
