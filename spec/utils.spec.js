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
  it("will take an array with an article object with an incorrect timestamp format and convert it into a javascript readable date object", () => {
    const article = [{ created_at: 1542284514171 }];
    const expected = [{ created_at: new Date(article[0].created_at) }];
    expect(formatDates(article)).to.eql(expected);
  });
  it("will take an array with all an article objects' details and return an array of the article object with all associated info. WITHOUT MUTATING THE INPUT ARRAY", () => {
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
  it("will take an array of multiple article objects and return an NEW array of all article objects", () => {
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
      }
    ];
    expect(formatDates(article)).to.eql(expected);
    expect(article).to.not.equal(expected);
  });
});

describe("makeRefObj", () => {
  it("will take an empty array of comments and return an empty object", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("will take a single article object with a title and article_id key in an array and return an object with the article's title as the key and the article's id as the value", () => {
    const article = [
      {
        article_id: 1,
        title: "Running a Node App"
      }
    ];
    const expected = { "Running a Node App": 1 };
    expect(makeRefObj(article)).to.eql(expected);
  });
  it("will take multiple article objects inside an array and return all article title and article ids as key-value pairs, ignoring the rest of the article info. input", () => {
    const articles = [
      {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and " +
          "running with Systemd and Node.js. This part dives " +
          "deeper into how to successfully run your app with " +
          "systemd long-term, and how to set it up in a production " +
          "environment.",
        votes: 0,
        topic: "coding",
        author: "jessjelly",
        created_at: "2016-08-18T12:07:52.389Z"
      },
      {
        article_id: 2,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        body:
          "Many people know Watson as the IBM-developed cognitive super " +
          "computer that won the Jeopardy! gameshow in 2011. In truth, Watson " +
          "is not actually a computer but a set of algorithms and APIs, and " +
          "since winning TV fame (and a $1 million prize) IBM has put it to " +
          "use tackling tough problems in every industry from healthcare to " +
          "finance. Most recently, IBM has announced several new partnerships " +
          "which aim to take things even further, and put its cognitive " +
          "capabilities to use solving a whole new range of problems around " +
          "the world.",
        votes: 0,
        topic: "coding",
        author: "jessjelly",
        created_at: "2017-07-20T20:57:53.256Z"
      }
    ];
    const expected = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2
    };
    expect(makeRefObj(articles)).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("will take an empty reference object and empty array of comments and return an empty array", () => {
    expect(formatComments({}, [])).to.eql([]);
  });
  it("will take a reference object with one key-value pair and a comments array with a single comments object and change the 'belongs_to' key value pair in the comments object to 'article_id' and it's relevant id number", () => {
    const articleRefObj = { "Running a Node App": 1 };
    const comment = [
      {
        belongs_to: "Running a Node App"
      }
    ];
    const expected = [
      {
        article_id: 1
      }
    ];
    expect(formatComments(articleRefObj, comment)).to.eql(expected);
  });
  it("will take a reference object with multiple key value pairs and an array of multiple comments and return the comments with all article_ids replacing the belongs_to key WITHOUT MUTATING THE INPUT ARRAY", () => {
    const articleRefObj = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2
    };
    const comment = [
      {
        belongs_to: "Running a Node App"
      },
      {
        belongs_to:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World"
      }
    ];
    const expected = [{ article_id: 1 }, { article_id: 2 }];
    expect(formatComments(articleRefObj, comment)).to.eql(expected);
    expect(comment).to.not.equal(expected);
  });
  it("will reformat the timestamp value of 'created_at' to a legible js format", () => {
    const articleRefObj = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2
    };
    const comment = [
      {
        belongs_to: "Running a Node App",
        created_at: 1454293795551
      },
      {
        belongs_to:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        created_at: 1468655332950
      }
    ];
    const expected = [
      { article_id: 1, created_at: new Date(comment[0].created_at) },
      { article_id: 2, created_at: new Date(comment[1].created_at) }
    ];
    expect(formatComments(articleRefObj, comment)).to.eql(expected);
  });
  it("will change 'created_by' key to 'author' and delete the 'created_by' key", () => {
    const articleRefObj = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2
    };
    const comments = [
      {
        body:
          "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
        belongs_to: "Running a Node App",
        created_by: "weegembump",
        votes: 11,
        created_at: 1454293795551
      },
      {
        body:
          "Est pariatur quis ipsa culpa unde temporibus et accusantium rerum. Consequatur in occaecati aut non similique aut quibusdam. Qui sunt magnam iure blanditiis. Et est non enim. Est ab vero dolor.",
        belongs_to:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        created_by: "jessjelly",
        votes: -1,
        created_at: 1468655332950
      }
    ];
    const expected = [
      {
        article_id: 1,
        created_at: new Date(comments[0].created_at),
        body:
          "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
        author: "weegembump",
        votes: 11
      },
      {
        article_id: 2,
        created_at: new Date(comments[1].created_at),
        body:
          "Est pariatur quis ipsa culpa unde temporibus et accusantium rerum. Consequatur in occaecati aut non similique aut quibusdam. Qui sunt magnam iure blanditiis. Et est non enim. Est ab vero dolor.",
        author: "jessjelly",
        votes: -1
      }
    ];
    expect(formatComments(articleRefObj, comments)).to.eql(expected);
  });
});
