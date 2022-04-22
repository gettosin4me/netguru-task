const MovieModel = require('../models/movie');

class Movie {
  static async create({ title, released, genre, director, created_by }) {
    return MovieModel.create({
        title,
        released,
        genre,
        director,
        created_by
    });
  }

  static countTotalMovieCreated({ user_id, firstDay, lastDay }) {
    return MovieModel
    .find({
        created_by: user_id,
        created_at: {
            $gt: firstDay,
            $lte: lastDay,
        }
    })
    .countDocuments();
  }
  static async getAll({ limit, offset }) {
    return MovieModel
        .find({})
        .limit(limit)
        .skip(offset)
        .lean()
        .exec();
  }

  static async movieExists({ title, released, director }) {
    return MovieModel
        .findOne({
            title,
            released,
            director
        })
        .lean()
        .exec();
  }

  static async findOne(params) {
    return MovieModel
        .findOne({ ...params })
        .lean()
        .exec();
  }
}

module.exports = Movie;
