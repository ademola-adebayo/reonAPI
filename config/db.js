const mongoose = require('mongoose');

//connect to mongoose options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const connectDBWithRetry = async () => {
  try {
    console.log('MongoDB is connected'.info);
    await mongoose.connect(process.env.MONGO_URI, options);
  } catch (err) {
    mongoose.connection.on('error', (err) => {
      console.log(
        `MongoDB connection unsuccessful, retry after 5 seconds. ${err}`
      );
    });
    return setTimeout(connectDBWithRetry, 5000);
  }
};

module.exports = connectDBWithRetry;
