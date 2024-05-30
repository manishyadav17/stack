import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline
} from "@mui/icons-material";
import { Box, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments: initialComments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(initialComments);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, { text: newComment, replies: [] }]);
      setNewComment('');
    }
  };

  const handleReplyChange = (index, event) => {
    const updatedComments = comments.map((comment, i) =>
      i === index ? { ...comment, replyText: event.target.value } : comment
    );
    setComments(updatedComments);
  };

  const handleAddReply = (index) => {
    const updatedComments = comments.map((comment, i) => {
      if (i === index && comment.replyText.trim() !== '') {
        return {
          ...comment,
          replies: [...comment.replies, comment.replyText],
          replyText: '',
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleDeleteComment = (index) => {
    setComments(comments.filter((_, i) => i !== index));
  };

  const handleDeleteReply = (commentIndex, replyIndex) => {
    const updatedComments = comments.map((comment, i) => {
      if (i === commentIndex) {
        const updatedReplies = comment.replies.filter((_, j) => j !== replyIndex);
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, index) => (
            <Box key={`${name}-${index}`}>
              <Divider />
              <FlexBetween>
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment.text}
                </Typography>
                <IconButton onClick={() => handleDeleteComment(index)}>
                  <DeleteOutline />
                </IconButton>
              </FlexBetween>
              {comment.replies.map((reply, replyIndex) => (
                <FlexBetween key={replyIndex} sx={{ pl: "2rem" }}>
                  <Typography sx={{ color: main, m: "0.5rem 0" }}>
                    {reply}
                  </Typography>
                  <IconButton onClick={() => handleDeleteReply(index, replyIndex)}>
                    <DeleteOutline />
                  </IconButton>
                </FlexBetween>
              ))}
              <FlexBetween mt="1rem" pl="2rem">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add a reply"
                  value={comment.replyText || ''}
                  onChange={(e) => handleReplyChange(index, e)}
                />
                <IconButton onClick={() => handleAddReply(index)} sx={{ ml: 1 }}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
              </FlexBetween>
            </Box>
          ))}
          <Divider />
          <FlexBetween mt="1rem">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment"
              value={newComment}
              onChange={handleInputChange}
            />
            <IconButton onClick={handleAddComment} sx={{ ml: 1 }}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
