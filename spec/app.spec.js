process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("GET /api/topics will connect to the topics endpoint and return the topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).to.have.keys("slug", "description");
      });
  });
});
