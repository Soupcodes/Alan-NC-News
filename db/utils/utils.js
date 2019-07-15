exports.formatDates = articles => {
  if (!articles.length) return [];
  return articles.map(article => {
    //copy the array of articles as not to mutate the original input
    const articleCopy = { ...article };
    //reassign the timestamp to correct js format
    articleCopy.created_at = new Date(articleCopy.created_at);
    return articleCopy;
  });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
