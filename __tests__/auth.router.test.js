"use strict";
process.env.SECRET = "toes";

const { db } = require("../src/auth/models/index.model");
const supertest = require("supertest");
const { app } = require("../src/server");
const req = supertest(app);

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe("Testing the server", () => {
  it("testing the home route", async () => {
    const res = await req.get("/");
    expect(res.text).toEqual("Home route");
    expect(res.status).toEqual(200);
  });

  it("testing 404 on bad route", async () => {
    const response = await req.get("/asd");
    expect(response.status).toEqual(404);
  });

  it("testing 404 on bad method", async () => {
    const response = await req.patch("/food");
    expect(response.status).toEqual(404);
  });

  it("testing the signup route", async () => {
    const res = await req.post("/signup").send({
      username: "test",
      password: "test",
    });
    expect(res.status).toEqual(201);
  });

  it("testing the signin route", async () => {
    const res = await req.post("/signin").auth("test", "test");
    expect(res.status).toEqual(200);
  });

  it("testing the signin route", async () => {
    const res = await req.post("/signin").auth("test", "test123");
    expect(res.status).toEqual(500);
  });

  it("testing the get method", async () => {
    const res = await req.get("/users");
    expect(res.status).toEqual(200);
    expect(typeof res.body).toEqual("object");
  });
});
