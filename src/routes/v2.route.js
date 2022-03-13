"use strict";

const express = require("express");
const router = express.Router();
const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

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

module.exports = router;
