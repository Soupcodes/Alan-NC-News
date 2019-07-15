process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("GET /api/topics will connect to the topics endpoint and return the topics objects in an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics[0]).to.have.keys("slug", "description");
      });
  });
  it("GET /api/users/:username will connect to the username endpoint and return a user object with all their properties", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        expect(body.user[0]).to.have.keys("username", "avatar_url", "name");
      });
  });
});
