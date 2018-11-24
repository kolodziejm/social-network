const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();

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
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));