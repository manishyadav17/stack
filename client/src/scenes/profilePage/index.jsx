import { Box, Button, TextField, useMediaQuery, Snackbar, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);
      setEditableUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', editableUser.firstName);
      formData.append('lastName', editableUser.lastName);
      formData.append('email', editableUser.email);
      formData.append('location', editableUser.location);
      formData.append('occupation', editableUser.occupation);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setError('Failed to update profile. Please try again.');
      setSuccessMessage(null);
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {isEditing ? (
            <Box>
              <TextField
                label="First Name"
                name="firstName"
                value={editableUser.firstName || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={editableUser.lastName || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={editableUser.email || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                name="location"
                value={editableUser.location || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Occupation"
                name="occupation"
                value={editableUser.occupation || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Box display="flex" alignItems="center" margin="normal">
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="icon-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="icon-button-file">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                {image && <span>{image.name}</span>}
              </Box>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={handleEditToggle} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          ) : (
            <Box>
              <Button onClick={handleEditToggle} variant="contained" color="primary">
                Edit Profile
              </Button>
              <Box m="1rem 0" />
              <MyPostWidget picturePath={user.picturePath} />
              <Box m="2rem 0" />
              <PostsWidget userId={userId} isProfile />
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        message={successMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ProfilePage;
