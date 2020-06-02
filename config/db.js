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
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB is connected`);
  } catch (err) {
    mongoose.connection.on('error', (err) => {
      console.log(
        `MongoDB connection unsuccessful, retry after 5 seconds. ${err.message}`
      );
    });
    return setTimeout(connectDBWithRetry, 5000);
    process.exit(1)
  }
};

module.exports = connectDBWithRetry;
