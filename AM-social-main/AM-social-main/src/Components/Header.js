import {
  AppBar,
  Avatar,
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const pages = [];
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const settings = ["Change Password", "Edit Profile", "Logout"];
function Header() {
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUser] = useState(
    (JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user"))) ||
      ""
  );
  const [open, setOpen] = React.useState(false);
  const [message, setMassage] = useState("");
  const [status, setStatus] = useState("");
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    console.log("first");
    setAnchorElNav(null);
  };
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("user") === null &&
      localStorage.getItem("token") === null
    ) {
      navigate("/login");
    }
  }, []);

  const handle = async () => {
    if (newPass === confirm) {
      if (user.password === password) {
        axios
          .put(`http://localhost:3000/Change/${user._id}`, {
            password: newPass,
          })
          .then((res) => {
            console.log(res);

            setTimeout(() => {
              setStatus("success");
              setMassage("Password change successfully!!!");
              setOpen(true);
              setOpen1(false);
            }, 1000);
          });
      } else {
        setStatus("error");
        setMassage("Old password is not matching!!!");
        setOpen(true);
      }
    } else {
      setStatus("error");
      setMassage("New Password And Confirm Password should be same!!!");
      setOpen(true);
    }
  };
  const handleCloseUserMenu = (ss) => {
    if (ss === "Change Password") navigate("/Change");
    else if (ss === "Edit Profile") navigate("/EditProfile");
    else if (ss === "Logout") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setStatus("succes");
      setMassage("Logout Successfully");
      setOpen(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
    setAnchorElUser(null);
  };
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    setOpen(false);
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
      children: `${name.split("")[0]}${name.split("")[1]}`,
    };
  }

  return (
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

      <AppBar position="static" style={{ minWidth: "172vh", marginLeft: -20 }}>
        <Container
          maxWidth="xl"
          sx={{
            backgroundColor: "#abe9cd",
            backgroundImage: "linear-gradient(315deg, #abe9cd 0%, #3eadcf 74%)",
          }}
        >
          <Modal
            open={open1}
            onClose={handleClose1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Container>
              <Grid xs={12}>
                <Grid
                  item
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                ></Grid>
                <Grid
                  item
                  container
                  xs={12}
                  component="main"
                  sx={{
                    width: "50vh",
                    height: "50vh",
                    padding: "5vh",
                    marginTop: "4%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    backgroundColor: "white",
                    border: "2px solid",
                    borderColor: "secondary.main",
                  }}
                >
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography sx={{ fontWeight: "light" }} variant="h6">
                      <b> Change Password</b>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TextField
                      size="small"
                      required
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      label="Current Password"
                      type="password"
                      // autoComplete="current-password"
                      error={false}
                      sx={{ minWidth: "80%", marginBottom: "10%" }}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TextField
                      size="small"
                      required
                      onChange={(e) => setNewPass(e.target.value)}
                      label="New Password"
                      type="password"
                      // autoComplete="current-password"
                      error={false}
                      sx={{ minWidth: "80%", marginBottom: "10%" }}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TextField
                      size="small"
                      required
                      onChange={(e) => setConfirm(e.target.value)}
                      label="Confirm Password"
                      type="password"
                      // autoComplete="current-password"
                      error={false}
                      sx={{ minWidth: "80%", marginBottom: "10%" }}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      type="submit"
                      onClick={handle}
                      variant="contained"
                      sx={{ maxWidth: "50%", maxHeight: "90%" }}
                    >
                      Change
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      type="cancel"
                      color="error"
                      onClick={() => setOpen1(false)}
                      variant="contained"
                      sx={{ maxWidth: "50%", maxHeight: "90%" }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Modal>
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              Welcome to AM Social..
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu()}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleCloseNavMenu()}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu()}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user && user.profile === "" ? (
                    <Avatar {...stringAvatar(user.firstName)} />
                  ) : (
                    <Avatar
                      src={require(`../../../../Node/images/Profile/${user.profile}`)}
                    />
                  )}
                  &nbsp;<h4 style={{ color: "white" }}>{user.firstName}</h4>
                  {/* <Avatar
                  alt="Remy Sharp"
                  src="https://ca.slack-edge.com/T0B4MLUM9-U02SUGS5MJM-46680907b77c-512"
                /> */}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={() => handleCloseUserMenu()}
              >
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => handleCloseUserMenu()}
                >
                  <MenuItem onClick={() => handleCloseUserMenu()}>
                    <Typography
                      component={Link}
                      to="/editprofile"
                      textAlign="center"
                      sx={{ textDecoration: "none" }}
                    >
                      Edit Profile
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleCloseUserMenu()}>
                    <Typography
                      onClick={handleOpen1}
                      textAlign="center"
                      sx={{ textDecoration: "none" }}
                    >
                      Change Password
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleCloseUserMenu()}>
                    <Typography
                      textAlign="center"
                      sx={{ textDecoration: "none" }}
                      onClick={() => handleLogOut()}
                    >
                      LogOut
                    </Typography>
                  </MenuItem>
                </Menu>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Container>
  );
}

export default Header;
