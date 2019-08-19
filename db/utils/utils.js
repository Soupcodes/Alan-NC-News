exports.formatDates = articles => {
  return articles.map(article => {
    const articleCopy = { ...article };
    articleCopy.created_at = new Date(articleCopy.created_at);
    return articleCopy;
  });
};

exports.makeRefObj = articles => {
  return articles.reduce((acc, cur) => {
    acc[cur.title] = cur.article_id;
    return acc;
  }, {});
};

exports.formatComments = (articleRef, comments) => {
  return comments.map(comment => {
    const commentCopy = { ...comment };
    commentCopy.article_id = articleRef[comment.belongs_to];
    delete commentCopy.belongs_to;
    if (comment.created_at) {
      commentCopy.created_at = new Date(commentCopy.created_at);
    }
    if (commentCopy.created_by) {
      commentCopy.author = commentCopy.created_by;
      delete commentCopy.created_by;
    }
    return commentCopy;
  });
};
