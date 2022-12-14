import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

export default function MealCommentList({ comments, mealId }) {
  const [comment, setComment] = useState('');
  const [commentsArray, setCommentsArray] = useState(comments);

  const { doRequest: addComment, errors } = useRequest({
    url: '/api/comments',
    method: 'post',
    body: {
      comment,
      mealId,
      dateMade: new Date(),
    },
    onSuccess: (event) => {
      comments.push(event);
      setCommentsArray(comments);
      setComment('');
    },
  });
  const onSubmit = (event) => {
    event.preventDefault();

    addComment();
  };

  const updateComments = (updatedComments) => {
    setCommentsArray([...updatedComments]);
  };

  const commentList = comments.map((commentItem) => {
    return (
      <CommentListItem
        comment={commentItem}
        key={commentItem.id}
        comments={commentsArray}
        updateComments={updateComments}
      />
    );
  });

  return (
    <>
      <div className="list-group">{commentList}</div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Add Comment</label>
          <input
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
}

export function CommentListItem({
  comment: commentItem,
  comments,
  updateComments,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentTime, setCommentTime] = useState(commentItem.dateMade);
  const [editedCommentTime, setEditedCommentTime] = useState(
    commentItem.dateMade
  );
  const [commentText, setCommentText] = useState(commentItem.comment);
  const [editedCommentText, setEditedCommentText] = useState(
    commentItem.comment
  );

  const { doRequest: deleteComment, errors: deleteCommentError } = useRequest({
    url: `/api/comments/${commentItem.id}`,
    method: 'delete',
    body: {},
    onSuccess: (event) => {
      var removeIndex = comments
        .map((commentItem) => commentItem.id)
        .indexOf(commentItem.id);
      ~removeIndex && comments.splice(removeIndex, 1);

      updateComments(comments);
    },
  });

  const { doRequest: updateComment, errors: updateCommentError } = useRequest({
    url: `/api/comments/${commentItem.id}`,
    method: 'put',
    body: {
      comment: editedCommentText,
      dateMade: editedCommentTime,
    },
    onSuccess: (event) => {
      console.log(event);
      setIsEditing(false);
    },
  });

  return (
    <div
      className="list-group-item list-group-item-action"
      key={commentItem.id}
    >
      <div className="d-flex w-100 justify-content-between">
        {isEditing ? (
          <input
            type="datetime-local"
            id="datetime-local"
            value={editedCommentTime}
            onChange={(e) => setEditedCommentTime(e.target.value)}
          />
        ) : (
          <p className="mb-1">{new Date(commentTime).toLocaleString()}</p>
        )}
        {isEditing ? (
          <span>
            <small
              className="bg-success rounded-pill btn"
              style={{ color: 'white' }}
              onClick={() => {
                // save editing variables
                setCommentText(editedCommentText);
                setCommentTime(editedCommentTime);
                updateComment(commentItem.id);
              }}
            >
              Save
            </small>{' '}
            <small
              className="bg-danger rounded-pill btn"
              style={{ color: 'white' }}
              onClick={() => {
                deleteComment(commentItem.id);
              }}
            >
              Delete
            </small>{' '}
            <small
              className="bg-primary rounded-pill btn"
              style={{ color: 'white' }}
              onClick={() => {
                // Reset editing variables
                setEditedCommentText(commentText);
                setEditedCommentTime(commentTime);
                setIsEditing(false);
              }}
            >
              Cancel
            </small>
          </span>
        ) : (
          <small
            className="bg-primary rounded-pill btn"
            style={{ color: 'white' }}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </small>
        )}
        {/* <small>3 days ago</small> */}
      </div>
      {isEditing ? (
        <div className="input-group" style={{ marginTop: '15px' }}>
          <input
            className="form-control"
            type="text"
            name=""
            id=""
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
          />
        </div>
      ) : (
        <h5 className="mb-1">{commentText}</h5>
      )}
    </div>
  );
}
