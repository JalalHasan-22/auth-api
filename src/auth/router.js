"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const base_64 = require("base-64");
const router = express.Router();
const { users } = require("../auth/models/index.model");
const basicAuth = require("../auth/middleware/basic");
const bearerAuth = require("../auth/middleware/bearer");
const acl = require("./middleware/acl");

// Routes
router.get("/users", getAllUsers);
router.post("/signup", signupHandler);
router.post("/signin", basicAuth, signinHandler);
router.get("/secret", bearerAuth, secretStuffHandler);
router.get("/img", bearerAuth, acl("read"), (req, res) => {
  res.send("you can read this image");
});
router.post("/img", bearerAuth, acl("create"), (req, res) => {
  res.send("new image was created");
});
router.put("/img", bearerAuth, acl("update"), (req, res) => {
  res.send("image updated");
});
router.delete("/img", bearerAuth, acl("delete"), (req, res) => {
  res.send("image deleted");
});

// Handlers
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
