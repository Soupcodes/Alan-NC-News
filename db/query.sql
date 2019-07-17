\c nc_news_test

SELECT articles.*, COUNT(comment_id)
FROM articles
  LEFT JOIN comments on articles.article_id = comments.article_id
  GROUP BY articles.article_id;