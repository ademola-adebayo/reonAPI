const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const Host = require('./config/keys').DB_HOST;
//db
//connect to mongoose options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => console.log(`DB Connected`));

mongoose.connection.on('error', (err) => {
  console.log(`DB Connection error: ${err.message}`);
});

// middleware

app.use(morgan('dev'));
// app.use(expressValidator())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
//app.use(cors());

if (process.env.NODE_ENV == 'development') {
  app.use(
    cors({
      origin: `${Host}:${port}`,
    })
  );
}

//bring in routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/api/user');
const postRoutes = require('./routes/api/post');
const profileRoutes = require('./routes/api/profile');

app.get('/', (req, res) => {
  res.send('ping pong');
});

// apiDocs
app.get('/api', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }

    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//add custom routes middleware
app.use('/api', postRoutes);
app.use('/api', profileRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});

app.listen(port, () => {
  console.log(`A Node Js API is listening on port: ${port}`);
});
