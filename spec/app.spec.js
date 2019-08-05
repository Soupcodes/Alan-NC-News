process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/", () => {
    it("will return a JSON file describing all the available endpoints on this API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).to.be.an("object");
        });
    });
  });

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
              expect(body.user).to.have.keys("username", "avatar_url", "name");
            });
        });
      });

      describe("Get errors", () => {
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
    describe("/", () => {
      describe("Get requests", () => {
        it("GET will return the articles array, defaulted to sort by the date in descending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("GET will return the articles array, defaulted to sort by article_id in descending order by default", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("article_id");
            });
        });
        it("GET will return the articles array, sorted by the author in descending alphabetical order by default", () => {
          return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("author");
            });
        });
        it("GET will return the articles array, sorted by the title in descending alphabetical order by default", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("title");
              expect(body.articles[0].title).to.equal("Z");
            });
        });
        it("GET will return the articles array, sorted by the topic in descending alphabetical order by default", () => {
          return request(app)
            .get("/api/articles?sort_by=topic")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("topic");
              expect(body.articles[0].topic).to.equal("mitch");
            });
        });
        it("GET will return the articles array, sorted by the votes in descending order by default", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("votes");
            });
        });
        it("GET will return the articles array, sorted by the comment_count in descending order by default", () => {
          return request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200)
            .then(({ body }) => {
              expect(+body.articles[0].comment_count).to.equal(13);
            });
        });
        it("GET will return the articles array, sorting and ordering the date in ascending order", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("created_at");
            });
        });
        it("GET will return the articles array, sorting and ordering the article_id in ascending order", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("article_id");
            });
        });
        it("GET will return the articles array, sorting and ordering the author in ascending alphabetical order", () => {
          return request(app)
            .get("/api/articles?sort_by=author&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("author");
              expect(body.articles[0].author).to.equal("butter_bridge");
            });
        });
        it("GET will return the articles array, sorting and ordering the title in ascending alphabetical order", () => {
          return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("title");
              expect(body.articles[0].title).to.equal("A");
            });
        });
        it("GET will return the articles array, sorting and ordering the topic in ascending alphabetical order", () => {
          return request(app)
            .get("/api/articles?sort_by=topic&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("topic");
              expect(body.articles[0].topic).to.equal("cats");
            });
        });
        it("GET will return the articles array, sorting and ordering the votes in ascending order", () => {
          return request(app)
            .get("/api/articles?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("votes");
            });
        });
        it("GET will return the articles array, sorting and ordering the comment_count in ascending order", () => {
          return request(app)
            .get("/api/articles?sort_by=comment_count&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(+body.articles[0].comment_count).to.equal(0);
            });
        });
        it("GET will return the articles array, filtered by the username (articles.author) provided in the query", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(({ body }) => {
              body.articles.map(article => {
                expect(article.author).to.equal("butter_bridge");
              });
            });
        });
        it("GET will return the articles array, filtered by the topic provided in the query", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              body.articles.map(article => {
                expect(article.topic).to.equal("mitch");
              });
            });
        });
        describe("Pagination", () => {
          it("will by default limit the number of responses returned back to the client to 10 articles", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles[0]).to.have.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
                expect(body.articles).to.have.lengthOf(10);
              });
          });
          it("will accept a limit query which limits the number of responses returned back to the client", () => {
            return request(app)
              .get("/api/articles?limit=8")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.have.lengthOf(8);
              });
          });
          it("will accept a p (page) query which specifies which page number the responses returned back to the client should begin", () => {
            return request(app)
              .get("/api/articles?limit=5&p=2")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.have.lengthOf(5);
                expect(body.articles[0]).to.eql({
                  author: "icellusedkars",
                  title: "A",
                  article_id: 6,
                  topic: "mitch",
                  created_at: "1998-11-20T12:21:54.171Z",
                  votes: 0,
                  comment_count: "1"
                });
              });
          });
          it("will return a status 200 and default back to the limit of 10 if the user enters value into the limit query which is not an integer", () => {
            return request(app)
              .get("/api/articles?limit=eight")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.have.lengthOf(10);
              });
          });
        });
        describe("Pagination errors", () => {
          it("will return a status 404 if the p query is too high and there are no further pages to display", () => {
            return request(app)
              .get("/api/articles?p=5")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Articles not found");
              });
          });
          it("will return a status 404 if the p query is negative", () => {
            return request(app)
              .get("/api/articles?p=-1")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Not Found");
              });
          });
          it("will return a status 400 if the p query is is not an integer", () => {
            return request(app)
              .get("/api/articles?p=two")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Invalid page Input");
              });
          });
        });
      });

      describe("Get errors", () => {
        it("GET will return a status 400 when attempting to query sort the array by a column that does not exist", () => {
          return request(app)
            .get("/api/articles?sort_by=category")
            .expect(400)
            .then(({ body }) => {
              expect(body.status).to.equal(400);
              expect(body.msg).to.equal("Invalid Input Detected");
            });
        });
        it("GET will return an error if provided an author that doesn't exist in the query", () => {
          return request(app)
            .get("/api/articles?author=soup")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Articles not found");
            });
        });
        it("GET will return an error if provided a topic that doesn't exist in the query", () => {
          return request(app)
            .get("/api/articles?topic=errorBambiNotFound")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Articles not found");
            });
        });
        it("GET will return a status 400 and return the sort_by column defaulted in descending order when querying order with a value that isn't 'asc' or 'desc'", () => {
          return request(app)
            .get("/api/articles?order=chaos")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid order Input");
            });
        });
      });

      describe("Method errors", () => {
        it("UNSPECIFIED METHODS will return a status 405 error", () => {
          const invalidMethods = ["post", "put", "patch"];
          const returnError = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405);
          });
          return Promise.all(returnError);
        });
      });
    });

    describe("/:ARTICLE_ID", () => {
      describe("Get requests", () => {
        it("GET will connect to the article_id endpoint and return the article corresponding with the id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.have.keys(
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
        it("GET will create a comment_count key and default to 0 if there are no comments yet associated with the article", () => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
              expect(+body.article.comment_count).to.equal(0);
            });
        });
      });

      describe("Get errors", () => {
        it("GET will return a status 400 and bad request error message if incorrect id syntax is input", () => {
          return request(app)
            .get("/api/articles/bad-id-req")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
        it("GET will return a status 404 and error message if no article is found", () => {
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
        it("PATCH accepts an object input { inc_votes: newVote } where 'newVote' indicates how many votes the article gets updated by and responds with a status 200 and the updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 101,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("PATCH will accept a negative newVote value and responds with a status 201 and the updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 0,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("PATCH will return a status 200 and the updated article, ignoring any additional properties have been included on the request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1, by: "Aladdin" })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 101,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("PATCH will return a status 200 and IGNORE the patch request when no value is included in the inc_votes body, returning the unchanged article as a result", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "" })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
      });

      describe("Patch errors", () => {
        it("PATCH will return a status 400 and a bad request error message when the format of the value of inc_votes is not a number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
        it("PATCH will return a status 400 and a bad request error if attempting to connect to the article_id that isn't an integer", () => {
          return request(app)
            .patch("/api/articles/not-an-id")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
        it('PATCH will return a status 400 and a bad request error when "inc_votes isn\'t used as the key of the post"', () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ change_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
        it("PATCH will return a status 404 and a not found error message when the article_id being accessed doesn't exist", () => {
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

      describe("Delete requests", () => {
        it("DELETE of a valid article id will return a status 204", () => {
          return request(app)
            .delete("/api/articles/1")
            .expect(204);
        });
      });
      //   describe("Delete errors", () => {
      //     it("DELETE of an invalid comment id will return an error message as nothing will have been deleted", () => {
      //       return request(app)
      //         .delete("/api/comments/100")
      //         .expect(404)
      //         .then(({ body }) => {
      //           expect(body.msg).to.equal(
      //             "Comment not found, nothing was deleted"
      //           );
      //           expect(body.status).to.equal(404);
      //         });
      //     });
      //     it("DELETE of a comment id that is not in integer format will return a code 400 and bad request error message as nothing will have been accessed", () => {
      //       return request(app)
      //         .delete("/api/comments/not-an-id")
      //         .expect(400)
      //         .then(({ body }) => {
      //           expect(body.msg).to.equal("Invalid Input Detected");
      //           expect(body.status).to.equal(400);
      //         });
      //     });

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
          it("POST will return a status 201 and respond with an object of the details of the posted comment", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "I can't see the light behind the shadow!"
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).to.contain.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
                expect(body.comment.body).to.equal(
                  "I can't see the light behind the shadow!"
                );
              });
          });
        });

        describe("Post errors", () => {
          it("POST will return a status 404 and respond with a user not found message when trying to post a comment with a username that doesn't exist", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "soup",
                body: "You need to exist first"
              })
              .expect(404)
              .then(({ body }) => {
                expect(body.status).to.equal(404);
              });
          });
          it("POST will return a status 400 and a bad request error message when posting a comment to an article_id that isn't an id ", () => {
            return request(app)
              .post("/api/articles/thou-shalt-not-pass/comments")
              .send({
                username: "soup",
                body: "I can't see the light behind the shadow!"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal("Invalid Input Detected");
              });
          });
          it("POST will return a status 404 and an id doesn't exist error message when posting a comment to an article_id that doesn't exist", () => {
            return request(app)
              .post("/api/articles/0/comments")
              .send({
                username: "soup",
                body: "I can't see the light behind the shadow!"
              })
              .expect(404)
              .then(({ body }) => {
                expect(body.status).to.equal(404);
                expect(body.msg).to.equal("Not Found");
              });
          });
          it('POST will return a status 400 and a bad request error when "username" isn\'t used as the key of the post', () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                user: "soup",
                body: "I can't see the light behind the shadow!"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
                expect(body.status).to.equal(400);
              });
          });
          it('POST will return a status 400 and a bad request error when "body" isn\'t used as the key of the post', () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "soup",
                comment: "I can't see the light behind the shadow!"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
                expect(body.status).to.equal(400);
              });
          });
          it("POST will return a status 400 and a bad request error when the body key of the post is missing", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "soup" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
                expect(body.status).to.equal(400);
              });
          });
          it("POST will return a status 400 and a bad request error when the username key of the post is missing", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                body: "I can't see the light behind the shadow!"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
                expect(body.status).to.equal(400);
              });
          });
          it("POST will return a status 400 and a bad request error when no value is included on the username key", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "",
                body: "I can't see the light behind the shadow!"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
                expect(body.status).to.equal(400);
              });
          });
          it("POST will return a status 400 and a bad request error when no value is included on the body key", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "soup",
                body: ""
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
                expect(body.status).to.equal(400);
              });
          });
          it("POST will return a status 400 and respond with an message if any additional key-value pairs that are included", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "I can't see the light behind the shadow!",
                random: "This will be ignored"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Post error, please try again");
              });
          });
        });

        describe("Get requests", () => {
          it("GET will return a status 200 and an array of comments for the specified article_id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.have.keys(
                  "article_id",
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
                expect(body.comments[0].article_id).to.equal(1);
              });
          });
          it("GET will return a status 200 and an array of empty comment details for an article_id that exists but has no comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.eql([]);
              });
          });
          it("GET will return a status 200 and DEFAULT sort the array by the date at which comments are created for an article_id in descending order", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("created_at");
                expect(body.comments[0].article_id).to.equal(1);
              });
          });
          it("GET will return a status 200 and accepts a query to sort the article_id column the array, sorting by article_id will sort by created at in descending order as only 1 article id will be pulled on any one request", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=article_id")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("article_id");
                expect(body.comments).to.be.descendingBy("created_at");
                expect(body.comments[0].article_id).to.equal(1);
              });
          });
          it("GET will return a status 200 and accepts a query to sort the comment_id column of the array, defaulted to descending order", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=comment_id")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("comment_id");
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to sort the author column of the array, defaulting sort_by to 'created_at' in descending order as there is only one article author value", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("author");
                expect(body.comments[0].author).to.equal("icellusedkars");
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to sort the votes column of the array, default sorting in descending order", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("votes");
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to sort the body column of the array", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=body")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.eql({
                  article_id: 1,
                  comment_id: 18,
                  votes: 16,
                  created_at: "2000-11-26T12:36:03.389Z",
                  body: "This morning, I showered for nine minutes.",
                  author: "butter_bridge"
                });
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to order the article_id column in ascending order, sort_by author will sort_by created at", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=article_id&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("article_id");
                expect(body.comments).to.be.ascendingBy("created_at");
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to order the comment_id column of the array in ascending order", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.ascendingBy("comment_id");
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to order the author column in ascending order, defaulting sort_by to 'created_at' as there is only one article author value", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("author");
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to order the votes column in ascending order", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.ascendingBy("votes");
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and accepts a query to sort the body column of the array", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=body&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.eql({
                  article_id: 1,
                  comment_id: 11,
                  votes: 0,
                  created_at: "2007-11-25T12:36:03.389Z",
                  body: "Ambidextrous marsupial",
                  author: "icellusedkars"
                });
                expect(body.comments[0].article_id).to.equal(1);
                expect(body.comments.length).to.equal(10);
              });
          });
          it("GET will return a status 200 and return the default array with the relevant sort and order defaults when attempting to query a sort key does not equal sort_by", () => {
            return request(app)
              .get("/api/articles/1/comments?sort=category")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.eql({
                  article_id: 1,
                  comment_id: 2,
                  votes: 14,
                  created_at: "2016-11-22T12:36:03.389Z",
                  body:
                    "The beautiful thing about treasure is that it exists. Got to find " +
                    "out what kind of sheets these are; not cotton, not rayon, silky.",
                  author: "butter_bridge"
                });
              });
          });
          it("GET will return a status 200 when attempting to query a key that isn't order", () => {
            return request(app)
              .get("/api/articles/1/comments?ascend=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.eql({
                  article_id: 1,
                  comment_id: 2,
                  votes: 14,
                  created_at: "2016-11-22T12:36:03.389Z",
                  body:
                    "The beautiful thing about treasure is that it exists. Got to find " +
                    "out what kind of sheets these are; not cotton, not rayon, silky.",
                  author: "butter_bridge"
                });
              });
          });
          describe("Pagination", () => {
            it("GET will return a status 200 and an array of comments defaultly limited to the 10 for the specified article_id", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments[0]).to.have.keys(
                    "article_id",
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  );
                  expect(body.comments[0].article_id).to.equal(1);
                  expect(body.comments).to.have.lengthOf(10);
                });
            });

            it("will accept a limit query which limits the number of comment responses returned back to the client", () => {
              return request(app)
                .get("/api/articles/1/comments?limit=8")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.have.lengthOf(8);
                });
            });
            it("will accept a p (page) query which specifies which page number the responses returned back to the client should begin", () => {
              return request(app)
                .get("/api/articles/1/comments?limit=5&p=2")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.have.lengthOf(5);
                  expect(body.comments[0]).to.eql({
                    article_id: 1,
                    comment_id: 7,
                    votes: 0,
                    created_at: "2011-11-24T12:36:03.389Z",
                    body: "Lobster pot",
                    author: "icellusedkars"
                  });
                });
            });
            it("will return a status 200 and default back to the limit of 10 if the user enters value into the limit query which is not an integer", () => {
              return request(app)
                .get("/api/articles/1/comments?limit=eight")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.have.lengthOf(10);
                });
            });
            it("will return a status 200 and an empty array of comments if the article exists but the p query is too high and there are no further pages to display", () => {
              return request(app)
                .get("/api/articles/1/comments?p=5")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.have.lengthOf(0);
                });
            });
          });
          describe("Pagination errors", () => {
            it("will return a status 400 if the p query is not an integer", () => {
              return request(app)
                .get("/api/articles/1/comments?p=two")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Invalid page Input");
                });
            });
            it("will return a status 404 if the p query is a  negative integer", () => {
              return request(app)
                .get("/api/articles/1/comments?p=-1")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Not Found");
                });
            });
          });
        });

        describe("Get errors", () => {
          it("GET will return a status 400 and an error message if attempting to get comments to an article_id isn't a number", () => {
            return request(app)
              .get("/api/articles/not-an-id/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal("Invalid Input Detected");
              });
          });
          it("GET will return a status 404 and an error message if attempting to get comments for an article_id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/100/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.status).to.equal(404);
                expect(body.msg).to.equal("Article not found");
              });
          });
          it("GET will return a status 400 when attempting to query sort the array by a column that does not exist", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=category")
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal("Invalid Input Detected");
              });
          });
          it("GET will return a status 400 when attempting to query sort to a parametric endpoint that doesn't exist", () => {
            return request(app)
              .get("/api/articles/100/comments?sort_by=category")
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal("Invalid Input Detected");
              });
          });
          it("GET will return a status 400 when attempting to query sort to a parametric endpoint that of invalid input", () => {
            return request(app)
              .get("/api/articles/not-an-id/comments?sort_by=category")
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal("Invalid Input Detected");
              });
          });
          it("GET will return a status 400 and return the sort_by column defaulted in descending order when querying order with a value that isn't 'asc' or 'desc'", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes&order=chaos")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Invalid order Input");
              });
          });
        });

        describe("Method errors", () => {
          it("UNSPECIFIED METHODS will return a status 405 error", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const returnError = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405);
            });
            return Promise.all(returnError);
          });
        });
      });
    });
  });

  describe("/COMMENTS", () => {
    describe("/:COMMENT_ID", () => {
      describe("Patch requests", () => {
        it("PATCH accepts an object input { inc_votes: newVote } where 'newVote' indicates how many votes the comment gets updated by and responds with a status 200 and the updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 17,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my " +
                  "nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("PATCH accepts a negative 'newVote' value, updates the votes value by the relevant amount and responds with a status 200 and the updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -16 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 0,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my " +
                  "nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("PATCH will return a status 200 and the updated article, ignoring any additional properties have been included on the request body", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -16, by: "mowgli" })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 0,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my " +
                  "nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("PATCH will return a status 200 and IGNORE the patch request when no value is included in the inc_votes body, returning the unchanged article as a result", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "" })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 16,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my " +
                  "nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
      });

      describe("Patch errors", () => {
        it("PATCH will return a status 400 and an bad request error message when the format of the value of inc_votes is not a number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
        it("PATCH will return a status 400 and a bad request error if attempting to connect to the comment_id that isn't an integer", () => {
          return request(app)
            .patch("/api/comments/not-an-id")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
        it('PATCH will return a status 400 and a bad request error when "inc_votes isn\'t used as the key of the post"', () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ change_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
              expect(body.status).to.equal(400);
            });
        });
        it("PATCH will return a status 404 and a not found error message when the comment_id being accessed doesn't exist", () => {
          return request(app)
            .patch("/api/comments/100")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment not found");
              expect(body.status).to.equal(404);
            });
        });
      });

      describe("Delete requests", () => {
        it("DELETE of a valid comment id will return a status 204", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
      });
      describe("Delete errors", () => {
        it("DELETE of an invalid comment id will return an error message as nothing will have been deleted", () => {
          return request(app)
            .delete("/api/comments/100")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Comment not found, nothing was deleted"
              );
              expect(body.status).to.equal(404);
            });
        });
        it("DELETE of a comment id that is not in integer format will return a code 400 and bad request error message as nothing will have been accessed", () => {
          return request(app)
            .delete("/api/comments/not-an-id")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid Input Detected");
              expect(body.status).to.equal(400);
            });
        });
      });

      describe("Method errors", () => {
        it("UNSPECIFIED METHODS will return a status 405 error", () => {
          const invalidMethods = ["get", "post", "put"];
          const returnError = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405);
          });
          return Promise.all(returnError);
        });
      });
    });
  });
});
