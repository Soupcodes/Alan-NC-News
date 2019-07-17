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
    it("UNSPECIFIED METHODS will return a status 405 error", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const returnError = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405);
      });
      return Promise.all(returnError);
    });
  });

  describe("/USERS", () => {
    describe("/:USERNAME", () => {
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
  });

  describe("/ARTICLES", () => {
    describe("/:ARTICLE_ID", () => {
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
      it("GET /:article_id will create a comment_count key and default to 0 if there are no comments yet associated with the article", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            expect(+body.article[0].comment_count).to.equal(0);
          });
      });
      it("GET /:article_id will return a status 404 and error message if no article is found", () => {
        return request(app)
          .get("/api/articles/100")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
            expect(body.status).to.equal(404);
          });
      });
      it("PATCH /:article_id accepts an object input { inc_votes: newVote } where 'newVote' indicates how many votes the article gets updated by and responds with a status 201 and the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 101,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            });
            expect(body.status).to.equal(200);
          });
      });
      it("PATCH /:article_id will accept a negative newVote value and responds with a status 201 and the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -100 })
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 0,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            });
            expect(body.status).to.equal(200);
          });
      });
      it("PATCH /:article_id will return a status 400 and an bad request error message when the format of the value of inc_votes is not a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "1" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Type error, please check your input");
            expect(body.status).to.equal(400);
          });
      });
      it("PATCH /:article_id will return a status 404 and a not found error message when the article_id being accessed doesn't exist", () => {
        return request(app)
          .patch("/api/articles/100")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
            expect(body.status).to.equal(404);
          });
      });
      describe("/COMMENTS", () => {
        it("POST will return a status 201 and respond with the body of the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "butter_bridge",
              body: "I can't see the light behind the shadow!"
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "I can't see the light behind the shadow!"
              );
            });
        });
        it("POST will return a status 400 and a bad request error message when posting a comment where the username is not in string format", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: 123,
              body: "I can't see the light behind the shadow!"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.status).to.equal(400);
              expect(body.msg).to.equal("Invalid username input");
            });
        });
        it("GET /:article_id/comments will return a status 200 and an array of comments for the specified article_id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.status).to.equal(200);
              expect(body.msg[0]).to.have.keys(
                "article_id",
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
              expect(body.msg[0].article_id).to.equal(1);
            });
        });
        it("GET /:article_id/comments will return a status 200 and an array of empty comment details for an article_id that exists but has no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.status).to.equal(200);
              expect(body.msg[0]).to.have.keys(
                "article_id",
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
              expect(body.msg[0].article_id).to.equal(2);
              expect(body.msg.length).to.equal(1);
            });
        });
        it("GET /:article_id/comments will return a status 404 and an error message if attempting to get comments for an article_id that doesn't exist", () => {
          return request(app)
            .get("/api/articles/100/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal("Article not found");
            });
        });
      });
    });
  });
});
