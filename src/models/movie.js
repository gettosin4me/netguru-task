const mongoose = require('mongoose');

const { Schema } = mongoose;

const MovieModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    released: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toObject: {
      virtuals: true,
      retainKeyOrder: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

MovieModelSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};

MovieModelSchema.index(
  {
    id: 1,
    created_at: -1,
  },
  {
    background: true,
  },
);

const MovieModel = mongoose.model('Movie', MovieModelSchema);

exports.MovieModel = MovieModel;

module.exports = MovieModel;
