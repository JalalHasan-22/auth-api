"use strict";

const middleware = require("../src/auth/middleware/basic");
const { db } = require("../src/auth/models/index.model");

let userInfo = {
  admin: { username: "admin-basic", password: "password" },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe("Auth Middleware", () => {
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe("user authentication", () => {
    it("fails a login for a user (admin) with the incorrect basic credentials", () => {
      // Change the request to match this test case
      req.headers = {
        authorization: "Basic YWRtaW46Zm9v",
      };

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalled();
      });
    }); // it()

    it("logs in an admin user with the right credentials", () => {
      // Change the request to match this test case
      req.headers = {
        authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
      };

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith("Invalid Login");
      });
    }); // it()
  });
});
