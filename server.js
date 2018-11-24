const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');


const app = express();

// app.use(bodyParser.urlencoded({
//   extended: false
// }));
app.use(bodyParser.json());

// Db config
const db = require('./config/keys').mongoURI;
// Connect to mongoDB
mongoose.connect(db)
  .then(res => {
    console.log('Mongodb connected')
  })
  .catch(err => console.log(err));

app.get('/', (req, res, next) => res.send('Hello world'))

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));