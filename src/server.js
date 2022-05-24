'use strict';

const express = require('express');
const app = new express();
const errorHandler = require('./middleware/500.middleware');
const notFound = require('./middleware/404.middleware');
const v1Routes = require('./routes/v1.route');
const v2Routes = require('./routes/v2.route');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(v1Routes);
app.use(v2Routes);

app.get('/', (req, res) => {
  res.status(200).send('Home route');
});

const start = (port) => {
  app.listen(port, () => {
    console.log(`Server Running & listening on port ${port}`);
  });
};

app.use(errorHandler);
app.use('*', notFound);

module.exports = {
  app: app,
  start: start,
};
