const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const botDataRouter = require('./routes/botDataRouter');
const botMessageRouter = require('./routes/botMessageRouter');
const botMusicPlayerRouter = require('./routes/botMusicPlayerRouter');

const app = express();

app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000,
    },
  })
);

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/music', botMusicPlayerRouter);
app.use('/api/server', botDataRouter);
app.use('/api/message', botMessageRouter);
// Diğer route dosyalarını da burada kullanın.

module.exports = app;