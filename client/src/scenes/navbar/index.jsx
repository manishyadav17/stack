import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpInput, setHelpInput] = useState("");
  const [submittedQueries, setSubmittedQueries] = useState([]);
  const [replyInput, setReplyInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New friend request", read: false },
    { id: 2, text: "New message received", read: false },
    { id: 3, text: "Profile update successful", read: true },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleHelpSubmit = () => {
    if (helpInput.trim()) {
      setSubmittedQueries((prevQueries) => [
        ...prevQueries,
        { query: helpInput, replies: [] },
      ]);
      setHelpInput("");
    } else {
      console.log("Input is empty");
    }
  };

  const handleReplySubmit = (index) => () => {
    if (replyInput.trim()) {
      setSubmittedQueries((prevQueries) => {
        const updatedQueries = [...prevQueries];
        updatedQueries[index].replies.push(replyInput);
        return updatedQueries;
      });
      setReplyInput("");
    } else {
      console.log("Reply input is empty");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const isContentAvailable = checkContentAvailability(searchQuery);

      if (isContentAvailable) {
        navigate("/home");
      } else {
        alert("Content not available for the search query.");
      }

      setSearchQuery("");
    } else {
      console.log("Search query is empty");
    }
  };

  const checkContentAvailability = (query) => {
    return query.trim() !== "";
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
    navigate("/notifications/" + notificationId);
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          UseMedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <IconButton onClick={handleSearch}>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton component={Link} to="/chat">
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={() => setIsNotificationsOpen(true)}>
            <Badge
              badgeContent={
                notifications.filter((notification) => !notification.read)
                  .length
              }
              color="secondary"
            >
              <Notifications sx={{ fontSize: "25px" }} />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setIsHelpOpen(true)}>
            <Help sx={{ fontSize: "25px" }} />
          </IconButton>

          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton component={Link} to="/chat">
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={() => setIsNotificationsOpen(true)}>
              <Badge
                badgeContent={
                  notifications.filter((notification) => !notification.read)
                    .length
                }
                color="secondary"
              >
                <Notifications sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <IconButton onClick={() => setIsHelpOpen(true)}>
              <Help sx={{ fontSize: "25px" }} />
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}

      <Dialog
        open={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          {notifications.length === 0 ? (
            <Typography>No new notifications</Typography>
          ) : (
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    backgroundColor: notification.read
                      ? neutralLight
                      : primaryLight,
                    borderRadius: "5px",
                    mb: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <ListItemText primary={notification.text} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isMessengerOpen} onClose={() => setIsMessengerOpen(false)}>
        <DialogTitle>Messenger</DialogTitle>
        <DialogContent>
          <Typography>No new messages</Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          <Typography>How can we assist you?</Typography>
          <TextField
            label="Enter your query"
            variant="outlined"
            fullWidth
            margin="normal"
            value={helpInput}
            onChange={(e) => setHelpInput(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleHelpSubmit}
          >
            Submit
          </Button>
          {submittedQueries.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Reply Section:
              </Typography>
              <List>
                {submittedQueries.map((queryItem, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={queryItem.query} />
                    </ListItem>
                    {queryItem.replies.length > 0 && (
                      <List sx={{ pl: 2 }}>
                        {queryItem.replies.map((reply, replyIndex) => (
                          <ListItem key={replyIndex}>
                            <ListItemText primary={reply} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                    <TextField
                      label="Your Reply"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReplySubmit(index)}
                    >
                      Submit Reply
                    </Button>
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>
    </FlexBetween>
  );
};

export default Navbar;