"use strict";

const { users } = require("../models/index.model");
const base64 = require("base-64");

function basic(req, res, next) {
  const encodedHeaders = req.headers.authorization.split(" ")[1]; // "Basic dGFtaW06cGl6emE="
  const [username, password] = base64.decode(encodedHeaders).split(":"); // spread operator

  return users
    .authenticateBasic(username, password)
    .then((validUser) => {
      req.user = validUser;
      next();
    })
    .catch((err) => {
      next("Invalid Login");
    });
}

module.exports = basic;
