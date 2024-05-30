import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [isClip, setIsClip] = useState(false);
  const [clip, setClip] = useState(null);
  const [isAttachment, setIsAttachment] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isAudio, setIsAudio] = useState(false);
  const [audio, setAudio] = useState(null);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    if (clip) {
      formData.append("clip", clip);
      formData.append("clipPath", clip.name);
    }
    if (attachment) {
      formData.append("attachment", attachment);
      formData.append("attachmentPath", attachment.name);
    }
    if (audio) {
      formData.append("audio", audio);
      formData.append("audioPath", audio.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setClip(null);
    setAttachment(null);
    setAudio(null);
    setPost("");
  };

  const handleFileDelete = (fileType) => {
    if (fileType === "image") setImage(null);
    if (fileType === "clip") setClip(null);
    if (fileType === "attachment") setAttachment(null);
    if (fileType === "audio") setAudio(null);
  };

  const renderDropzone = (fileType, setFile) => (
    <Box
      border={`1px solid ${medium}`}
      borderRadius="5px"
      mt="1rem"
      p="1rem"
    >
      <Dropzone
        acceptedFiles={
          fileType === "image"
            ? ".jpg,.jpeg,.png"
            : fileType === "clip"
            ? ".gif"
            : fileType === "attachment"
            ? ".pdf,.doc,.docx"
            : ".mp3,.wav"
        }
        multiple={false}
        onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
      >
        {({ getRootProps, getInputProps }) => (
          <FlexBetween>
            <Box
              {...getRootProps()}
              border={`2px dashed ${palette.primary.main}`}
              p="1rem"
              width="100%"
              sx={{ "&:hover": { cursor: "pointer" } }}
            >
              <input {...getInputProps()} />
              {!(
                (fileType === "image" && image) ||
                (fileType === "clip" && clip) ||
                (fileType === "attachment" && attachment) ||
                (fileType === "audio" && audio)
              ) ? (
                <p>Add {fileType.charAt(0).toUpperCase() + fileType.slice(1)} Here</p>
              ) : (
                <FlexBetween>
                  <Typography>
                    {(fileType === "image" && image.name) ||
                      (fileType === "clip" && clip.name) ||
                      (fileType === "attachment" && attachment.name) ||
                      (fileType === "audio" && audio.name)}
                  </Typography>
                  <EditOutlined />
                </FlexBetween>
              )}
            </Box>
            {(fileType === "image" && image) ||
            (fileType === "clip" && clip) ||
            (fileType === "attachment" && attachment) ||
            (fileType === "audio" && audio) ? (
              <IconButton
                onClick={() => handleFileDelete(fileType)}
                sx={{ width: "15%" }}
              >
                <DeleteOutlined />
              </IconButton>
            ) : null}
          </FlexBetween>
        )}
      </Dropzone>
    </Box>
  );

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && renderDropzone("image", setImage)}
      {isClip && renderDropzone("clip", setClip)}
      {isAttachment && renderDropzone("attachment", setAttachment)}
      {isAudio && renderDropzone("audio", setAudio)}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem" onClick={() => setIsClip(!isClip)}>
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Clip
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" onClick={() => setIsAttachment(!isAttachment)}>
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Attachment
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" onClick={() => setIsAudio(!isAudio)}>
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Audio
              </Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
