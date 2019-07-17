process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/ROUTE-NOT-FOUND", () => {
    describe("Error", () => {
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
  });

  describe("/TOPICS", () => {
    describe("Get requests", () => {
      it("GET /topics will connect to the topics endpoint and return the topics objects in an array", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.have.keys("slug", "description");
          });
      });
    });

    describe("Method errors", () => {
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
  });

  describe("/USERS", () => {
    describe("/:USERNAME", () => {
      describe("Get requests", () => {
        it("GET /:username will connect to the username endpoint and return a user object with all their properties", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body }) => {
              expect(body.user[0]).to.have.keys(
                "username",
                "avatar_url",
                "name"
              );
            });
        });
      });
      describe("Get errors", () => {
        //SQL won't flag an error as the input is valid, it will return an empty array
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
      describe("Method errors", () => {
        it("UNSPECIFIED METHODS will return a status 405 error", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const returnError = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/lurker")
              .expect(405);
          });
          return Promise.all(returnError);
        });
      });
    });
  });

  describe("/ARTICLES", () => {
    describe("/:ARTICLE_ID", () => {
      describe("Get requests", () => {
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
      });
      describe("Get errors", () => {
        it("GET /:article_id will return a status 400 and bad request error message if incorrect id syntax is input", () => {
          return request(app)
            .get("/api/articles/bad-id-req")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input Error Detected");
              expect(body.status).to.equal(400);
            });
        });
        //Not an SQL error as input is in correct format, so it will return an empty array
        it("GET /:article_id will return a status 404 and error message if no article is found", () => {
          return request(app)
            .get("/api/articles/100")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article not found");
              expect(body.status).to.equal(404);
            });
        });
      });
      describe("Patch requests", () => {
        it("PATCH /:article_id accepts an object input { inc_votes: newVote } where 'newVote' indicates how many votes the article gets updated by and responds with a status 200 and the updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.msg[0]).to.eql({
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
              expect(body.msg[0]).to.eql({
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
      });
      describe("Patch errors", () => {
        //SQL will detect that the inc_votes value is not an integer and throw an error
        it("PATCH /:article_id will return a status 400 and an bad request error message when the format of the value of inc_votes is not a number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input Error Detected");
              expect(body.status).to.equal(400);
            });
        });

        it("PATCH /:article_id will return a status 400 and a bad request error if attempting the article_id isn't an integer", () => {
          return request(app)
            .patch("/api/articles/not-an-id")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input Error Detected");
              expect(body.status).to.equal(400);
            });
        });

        it('PATCH /:article_id will return a status 400 and a bad request error when "inc_votes isn\'t used as the key of the post"', () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ change_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
              expect(body.status).to.equal(400);
            });
        });

        it("PATCH /:article_id will return a status 400 and a bad request error when no value is included in the inc_votes body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input Error Detected");
              expect(body.status).to.equal(400);
            });
        });

        it("PATCH /:article_id will return a status 200 and the updated article, ignoring any additional properties have been included on the request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1, by: "Aladdin" })
            .expect(200)
            .then(({ body }) => {
              expect(body.msg[0]).to.eql({
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

        it("PATCH /:article_id will return a status 404 and a not found error message when the article_id being accessed doesn't exist", () => {
          //article 100 could exist but has not been input yet so SQL will not throw an error, it will return an empty array
          return request(app)
            .patch("/api/articles/100")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article not found");
              expect(body.status).to.equal(404);
            });
        });
      });

      describe("Method errors", () => {
        it("UNSPECIFIED METHODS will return a status 405 error", () => {
          const invalidMethods = ["post", "put", "delete"];
          const returnError = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405);
          });
          return Promise.all(returnError);
        });
      });

      describe("/COMMENTS", () => {
        describe("Post requests", () => {
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
        });
        describe("Post errors", () => {
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
        });
        describe("Get requests", () => {
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
        });
        describe("Get errors", () => {
          it("GET /:article_id/comments will return a status 400 and an error message if attempting to get comments to an article_id isn't a number", () => {
            return request(app)
              .get("/api/articles/not-an-id/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal("Input Error Detected");
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

  describe("INTERNAL SERVER ERROR", () => {
    it("will return a server error status 500 and an internal server error message when the error has not been caught by any other error handler", () => {
      //Unsure how or whether can test this - errors caught by 500 should be fixed and an error handler created to catch
    });
  });
});
