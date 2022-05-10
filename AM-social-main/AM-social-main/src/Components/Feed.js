import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Link from "@mui/material/Link";
import axios from "axios";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import MuiAlert from "@mui/material/Alert";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  List,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  CardHeader,
  Button,
  Snackbar,
} from "@mui/material";
import Header from "./Header";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Feed() {
  let navigate = useNavigate();
  const imageRef = useRef();
  const [filename, setFilename] = useState("");
  const [filepath, setFilepath] = useState("");
  const [title, setTitle] = useState("");

  const [image, setImage] = useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [id, setId] = useState(-1);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user"))
  );
  const [commentObj, setCommentObject] = useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMassage] = useState("");
  const [status, setStatus] = useState("");
  const [viewComments, setViewComments] = useState(false);
  const [data2, setData2] = useState([]);
  const [limit, setlimit] = useState(3);
  const handleExpandClick = (i) => {
    setComment("");
    setExpanded(!expanded);
    setId(i);
  };
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || ""
  );
  const [data, setData] = useState([]);
  const handle = async () => {
    if (title !== "") {
      axios
        .post(`http://localhost:3000/api/AddFeed`, {
          image: filename,
          title: title,
          path: filepath,
          userId: user._id,
          userfirstName: user.firstName,
          likes: [],
          comments: [],
        })
        .then((res) => console.log(res));
      callme(3);
      setComment("");
      setImage("");
      setTitle("");
      setStatus("success");
      setMassage("Post Uploaded Succesfully");
      setOpen(true);
      imageRef.current.value = null;
      navigate("/");
    } else {
      setStatus("error");
      setMassage("Caption and Image is required !!!!!");
      setOpen(true);
    }
    console.log(filepath, filename, title);
  };

  const addComment = async (object) => {
    if (comment !== "") {
      axios
        .put(`http://localhost:3000/api/feed/${object._id}`, {
          comments: [...object.comments, { _id: user._id, comment: comment }],
        })
        .then((res) => {
          console.log(res);
          setStatus("success");
          setMassage("Comment Succesfully");
          setOpen(true);
          setComment("");
        })
        .catch((e) => console.log(e));
    } else {
      setStatus("error");
      setMassage("Enter Text For Comment");
      setOpen(true);
    }
    callme(3);
  };
  useEffect(() => {
    callme(3);
  }, []);

  const fetchMoreData = () => {
    setTimeout(() => {
      setlimit(limit + 3);
      callme(limit + 3);
    }, 2000);
  };

  const callme = async (i) => {
    axios
      .get(`http://localhost:3000/api/feed?limit=${i}`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        setData(res.data.results);
      })
      .catch((err) => {
        alert("Access Denied");
        localStorage.removeItem("token");
        navigate("/login");
      });
    axios
      .get("http://localhost:3000/users")
      .then((res) => setData2(res.data))
      .catch((e) => console.log(e));
  };
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split("")[0][0]}${name.split("")[1][0]}`,
    };
  }

  const likes = async (obj) => {
    const ids = JSON.parse(localStorage.getItem("user"))._id;
    let l = obj.likes;
    if (l.includes(ids)) {
      l = l.filter((like) => like != ids);
      obj.likes = l;
      setStatus("success");
      setMassage("Disliked Succesfully");
      setOpen(true);
    } else {
      obj.likes.push(ids);
      setStatus("success");
      setMassage("Like Succesfully");
      setOpen(true);
    }
    data.map((post) => (post._id === obj._id ? (post = obj) : ""));
    setData(JSON.parse(JSON.stringify(data)));
    axios
      .put(`http://localhost:3000/api/feed/likes/${obj._id}`, {
        likes: obj.likes,
      })
      .then((res) => console.log(res.data));
    console.log(obj.likes);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      {token && (
        <Container>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={status === "error" ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
          <Header />
          <Card
            position="static"
            sx={{
              marginLeft: "2%",
              width: "96%",
              fontSize: 20,
              marginTop: 2,
              backgroundColor: "#e0f7fa",
            }}
          >
            <CardHeader
              style={{
                backgroundColor: "#abe9cd",
                backgroundImage:
                  "linear-gradient(315deg, #abe9cd 0%, #3eadcf 74%)",
              }}
              title={
                <Typography
                  variant="h5"
                  color="white"
                  sx={{
                    fontWeight: "bold",

                    textAlign: "center",
                  }}
                  component="h4"
                >
                  Add Feed
                </Typography>
              }
            ></CardHeader>
            <Grid container xs={12} component="main" sx={{ minHeight: "40vh" }}>
              <Grid
                xs={6}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  sx={{
                    marginTop: "4vh",
                    marginLeft: "2vh",
                  }}
                  container
                  xs={6}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <TextField
                    value={title}
                    id="outlined-basic"
                    label="Caption"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <br />
                  <br />
                </Grid>
                <Grid
                  container
                  xs={6}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <input
                    type="file"
                    ref={imageRef}
                    style={{ fontSize: "80%", marginLeft: 50 }}
                    onChange={(e) => {
                      console.log(e.target.value);

                      setImage(e.target.files[0].name);
                      setFilename(e.target.files[0].name);
                      setFilepath(e.target.value);
                      let formData = new FormData();
                      formData.append("image", e.target.files[0]);
                      axios
                        .post("http://localhost:3000/api/upload", formData)
                        .then((res) => console.log(res));
                      setStatus("success");
                      setMassage("File Uploaded Succesfully");
                      setOpen(true);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={4}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                  marginTop: "2vh",
                }}
              >
                {image !== "" && (
                  <img
                    style={{
                      maxHeight: "90%",
                      maxWidth: "90%",
                      height: "30vh",
                      width: "90vh",
                    }}
                    src={require(`../../../../Node/images/${image}`)}
                  ></img>
                )}
              </Grid>
            </Grid>

            <CardActions style={{ backgroundColor: "#fff3e0" }}>
              {" "}
              <Grid
                xs={12}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ padding: "1%" }}
              >
                <Button
                  variant="contained"
                  onClick={() => handle()}
                  sx={{ width: "10%", height: "8%" }}
                >
                  Post
                </Button>
              </Grid>
            </CardActions>
          </Card>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchMoreData}
            hasMore={true}
            loader={
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={12}
                  style={{ marginTop: 20 }}
                >
                  <Grid
                    container
                    md={12}
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-end"
                  >
                    <Box
                      sx={{
                        width: "35%",
                        height: "70vh",
                      }}
                    >
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        width={40}
                        height={40}
                      />
                      <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                      />
                      <Skeleton animation="wave" height={10} width="40%" />
                      <Skeleton
                        sx={{ height: 190 }}
                        animation="wave"
                        variant="rectangular"
                      />
                      <Skeleton
                        animation="wave"
                        height={10}
                        style={{ marginBottom: 6 }}
                      />
                      <Skeleton animation="wave" height={10} width="80%" />
                    </Box>
                  </Grid>
                </Grid>
              </>
            }
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <Grid
              item
              container
              direction="row"
              justifyContent="flex-start"
              spacing={3}
            >
              {data &&
                data.map((obj, index) => {
                  return (
                    <Grid item md={12} key={obj._id}>
                      <center>
                        <Card
                          sx={{
                            maxWidth: "50vh",
                            minWidth: "50%",
                            marginRight: "1%",
                            marginTop: 3,
                            boxShadow: 5,
                          }}
                          key={index}
                        >
                          <CardHeader
                            style={{
                              backgroundColor: "#abe9cd",
                              backgroundImage:
                                "linear-gradient(315deg, #abe9cd 0%, #3eadcf 74%)",
                            }}
                            avatar={data2.map((d) =>
                              d._id === obj.userId && d.profile !== "" ? (
                                <Avatar
                                  src={require(`../../../../Node/images/Profile/${d.profile}`)}
                                />
                              ) : d._id === obj.userId && d.profile === "" ? (
                                <Avatar {...stringAvatar(obj.userfirstName)} />
                              ) : (
                                ""
                              )
                            )}
                            title={
                              <Typography
                                variant="h5"
                                color="white"
                                sx={{ fontWeight: "bold", float: "left" }}
                                component="h4"
                              >
                                {obj.userfirstName}
                              </Typography>
                            }
                          ></CardHeader>

                          <CardContent>
                            <img
                              style={{ maxHeight: "30vh", height: "30vh" }}
                              src={require(`../../../../Node/images/${obj.image}`)}
                              alt="Trulli"
                            />
                            {/* <Typography gutterBottom variant="" component="div"> */}
                            <h3>{obj.title}</h3>
                            {/* </Typography> */}
                          </CardContent>
                          <CardActions
                            style={{
                              backgroundColor: "#fff3e0",
                              maxHeight: "10vh",
                              padding: 0,
                            }}
                          >
                            <IconButton
                              aria-label="add to favorites"
                              onClick={() => likes(obj)}
                            >
                              <FavoriteIcon
                                color={
                                  obj.likes.includes(user._id)
                                    ? "secondary"
                                    : ""
                                }
                              />
                              <h6>{obj.likes.length}</h6>
                            </IconButton>
                            <ExpandMore
                              expand={expanded && index === id}
                              onClick={() => handleExpandClick(index)}
                              aria-expanded={expanded}
                              aria-label="show more"
                            >
                              <IconButton aria-label="add to favorites">
                                <CommentIcon />
                              </IconButton>
                            </ExpandMore>
                            <IconButton
                              aria-label="add to favorites"
                              style={{ marginLeft: -20 }}
                            >
                              <h6>{obj.comments.length}</h6>
                            </IconButton>
                          </CardActions>
                          <Collapse
                            in={expanded && index === id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <CardContent>
                              <Typography paragraph>Comment:</Typography>
                              <TextField
                                required
                                size="small"
                                id="fname"
                                type="text"
                                error={false}
                                placeholder="Comment"
                                name="fname"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                autoComplete="fname"
                                autoFocus
                                sx={{ minWidth: "80%", textAlign: "center" }}
                              />
                              <IconButton
                                aria-label="add to favorites"
                                onClick={() => addComment(obj)}
                              >
                                <ArrowCircleRightIcon />
                              </IconButton>

                              <Link
                                onClick={() =>
                                  viewComments
                                    ? setViewComments(false)
                                    : setViewComments(true)
                                }
                              >
                                <Button size="small">View Comment</Button>
                              </Link>

                              <Collapse
                                in={viewComments && index === id}
                                timeout="auto"
                                unmountOnExit
                              >
                                {obj.comments.map((c, i) => (
                                  <List
                                    sx={{
                                      width: "100%",
                                      maxWidth: 360,
                                      bgcolor: "background.paper",
                                    }}
                                    key={c._id}
                                  >
                                    <ListItem alignItems="flex-start">
                                      <ListItemAvatar>
                                        {data2.map(
                                          (d) =>
                                            d._id === c._id && (
                                              <Avatar
                                                {...stringAvatar(
                                                  d && d.firstName
                                                )}
                                              />
                                            )
                                        )}
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={data2.map(
                                          (d) => d._id === c._id && d.firstName
                                        )}
                                        secondary={
                                          <React.Fragment>
                                            <Typography
                                              sx={{ display: "inline" }}
                                              component="span"
                                              variant="body2"
                                              color="text.primary"
                                            >
                                              {c.comment}
                                            </Typography>
                                          </React.Fragment>
                                        }
                                      />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                  </List>
                                ))}
                              </Collapse>
                            </CardContent>
                          </Collapse>
                        </Card>
                      </center>
                    </Grid>
                  );
                })}
            </Grid>
          </InfiniteScroll>
        </Container>
      )}
    </>
  );
}

export default Feed;
