"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { users } = require("../auth/models/index.model");
const basicAuth = require("../auth/middleware/basic");
const bearerAuth = require("../auth/middleware/bearer");

// Routes
router.get("/users", getAllUsers);
router.post("/signup", signupHandler);
router.post("/signin", basicAuth, signinHandler);
router.get("/secret", bearerAuth, secretStuffHandler);

async function signupHandler(req, res, next) {
  let { username, password, role } = req.body;
  console.log(username, password);
  try {
    const hashedPassword = await bcrypt.hash(password, 14);
    const newUser = await users.create({
      username: username,
      password: hashedPassword,
      role: role,
      // token: user.token,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
}

function signinHandler(req, res) {
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
    },
    token: req.user.token,
    actions: req.user.actions,
  });
}

function secretStuffHandler(req, res) {
  res.status(200).send(`Welcome ${req.user.username}!`);
}

// for testing purposes only
// Please disregard
async function getAllUsers(req, res) {
  const allUsers = await users.findAll();
  res.status(200).json(allUsers);
}

module.exports = router;
