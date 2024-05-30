import { Box, Typography, Button, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendRequestWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friendRequests, setFriendRequests] = useState([]);

  const getFriendRequests = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friendRequests`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setFriendRequests(data);
  };

  const handleFriendRequest = async (requestId, action) => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friendRequests/${requestId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }), // "accept" or "reject"
      }
    );
    const result = await response.json();
    if (result.success) {
      // Update the friend list if a request is accepted
      if (action === "accept") {
        const updatedFriendsResponse = await fetch(
          `http://localhost:3001/users/${userId}/friends`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedFriends = await updatedFriendsResponse.json();
        dispatch(setFriends({ friends: updatedFriends }));
      }
      // Remove the request from the list
      setFriendRequests(friendRequests.filter(request => request._id !== requestId));
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
      
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friendRequests.map((request) => (
          <Box key={request._id} display="flex" alignItems="center" justifyContent="space-between">
            <Friend
              friendId={request._id}
              name={`${request.firstName} ${request.lastName}`}
              subtitle={request.occupation}
              userPicturePath={request.picturePath}
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => handleFriendRequest(request._id, "accept")}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleFriendRequest(request._id, "reject")}
              >
                Reject
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendRequestWidget;
