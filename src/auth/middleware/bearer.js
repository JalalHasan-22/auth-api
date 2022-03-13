"use strict";
const { users } = require("../models/index.model");

function bearer(req, res, next) {
  const bearerHeaderToken = req.headers.authorization.split(" ")[1]; // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhbWltIiwiaWF0IjoxNjM2MzY2MDgwfQ.OhHLD4yRWs1LlTloBjIs0j-QYzi8LdoQDXUfPaO0BSg

  return users
    .authenticateBearer(bearerHeaderToken)
    .then((userData) => {
      req.user = userData;
      next();
    })
    .catch(() => {
      next("Bearer token authentication error");
    });
}

module.exports = bearer;
