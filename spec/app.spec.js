process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/ROUTE-NOT-FOUND", () => {
    it("GET /route-not-found will return a status 404 and an error message", () => {
      return request(app)
        .get("/api/not-a-route")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found");
          expect(body.status).to.equal(404);
        });
    });
  });

  describe("/TOPICS", () => {
    it("GET /topics will connect to the topics endpoint and return the topics objects in an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).to.have.keys("slug", "description");
        });
    });
  });

  describe("/USERS", () => {
    it("GET /:username will connect to the username endpoint and return a user object with all their properties", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.user[0]).to.have.keys("username", "avatar_url", "name");
        });
    });
    it("GET /non-existent-user will return a status 404 and an error message", () => {
      return request(app)
        .get("/api/users/soup")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("User not found");
          expect(body.status).to.equal(404);
        });
    });
  });

  describe("/ARTICLES", () => {
    it("GET /:article_id will connect to the article_id endpoint and return the article corresponding with the id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
  });
});
