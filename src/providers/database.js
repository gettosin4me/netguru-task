module.exports = {
    async start(mongoose, { config, options }) {
      mongoose
        .connect(config.get('database.url'), options)
        .then((connection) => {
          console.log('database connected');
        })
        .catch((error) => {
          console.log(error.message);
        });
      mongoose.Promise = global.Promise;
    },
  };
  