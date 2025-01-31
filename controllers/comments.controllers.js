const deleteDatabaseComment = require("../models/comments.models");

const deleteComment = (request, response, next) => {
  const comment_id = request.params.comment_id;
  deleteDatabaseComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = deleteComment;
