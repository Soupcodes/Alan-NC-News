const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("will take an empty array of objects and return a new empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("will take an array with an article object containing the incorrect timestamp format and convert it into a javascript readable date object", () => {
    const article = [{ created_at: 1542284514171 }];
    const expected = [{ created_at: new Date(article[0].created_at) }];
    expect(formatDates(article)).to.eql(expected);
  });
  it("will take an array with an article object containing the timestamp in milliseconds and all remaining details then return an array of the article object with the correct timestamp format and remaining info.", () => {
    const article = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(article[0].created_at),
        votes: 100
      }
    ];
    expect(formatDates(article)).to.eql(expected);
    expect(article).to.not.equal(expected);
  });
  it("will take an array with multiple article objects and return an array of the article objects with the correct timestamp format and remaining info.", () => {
    const article = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(article[0].created_at),
        votes: 100
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(article[1].created_at)
        // votes: 0
      }
    ];
    expect(formatDates(article)).to.eql(expected);
    expect(article).to.not.equal(expected);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
