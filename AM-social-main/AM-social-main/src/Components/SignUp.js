import {
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function SignUp() {
  const navigate = useNavigate();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [postId, setPostId] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [message, setMassage] = useState("");
  const [status, setStatus] = useState("");

  const handleLogIn = async (e) => {
    let payload = {
      firstName: fName,
      lastName: lName,
      email: email,
      password: password,
    };
    if (!fName || !lName || !email || !password) {
      setStatus("error");
      setMassage("firstName, lastName, Email and Password cannot be empty!!");
      setOpen(true);
    } else {
      let flag = false;
      users.map((d) => (d.email === email ? (flag = true) : ""));
      if (flag === false) {
        axios
          .post("http://localhost:3000/signup", payload)
          .then((data) => {
            console.log(data);
            if (data.data.status === false) {
              setStatus("error");

              setMassage(data.data.error);
              setOpen(true);
            } else {
              setStatus("succes");
              setMassage("SignUp Succesfully");
              setOpen(true);
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            }
          })
          .catch((error) => {});
      } else {
        setStatus("error");
        setMassage("Email is already in registered");
        setOpen(true);
      }
    }
  };
  useEffect(() => {
    if (postId.message == "Users Inserted successfully") {
      setStatus("success");
      setMassage("Sign up Succesfully");
      setOpen(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [postId]);

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Container width="100vh">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={status === "error" ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Grid
        item
        container
        xs={12}
        component="main"
        sx={{
          width: "50vh",
          height: "75vh",
          padding: "5vh",
          marginTop: "4%",
          marginLeft: "auto",
          marginRight: "auto",
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
          <Typography
            color="secondary.main"
            sx={{ fontWeight: "light" }}
            variant="h6"
          >
            <b>
              <center> AM SOCIAL Sign Up</center>
            </b>
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
            required
            onChange={(e) => setFName(e.target.value)}
            size="small"
            id="fname"
            type="text"
            error={false}
            placeholder="First Name"
            name="fname"
            // autoComplete="fname"
            autoFocus
            sx={{ minWidth: "80%", textAlign: "center" }}
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
            required
            size="small"
            id="lname"
            type="text"
            error={false}
            placeholder="Last Name"
            name="lname"
            onChange={(e) => setLName(e.target.value)}
            // autoComplete="lname"
            sx={{ minWidth: "80%", textAlign: "center" }}
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
            required
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            id="email"
            type="email"
            error={false}
            placeholder="Email Address"
            name="email"
            // autoComplete="email"
            sx={{ minWidth: "80%", textAlign: "center" }}
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
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            required
            name="password"
            placeholder="password"
            type="password"
            id="password"
            // autoComplete="current-password"
            error={false}
            sx={{ minWidth: "80%" }}
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
            variant="contained"
            sx={{ minWidth: "50%" }}
            onClick={(e) => handleLogIn(e)}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {postId != "" && (
            <Box
              color="red"
              sx={{
                textAlign: "center",
                m: 1,
                textTransform: "lowercase",
                fontWeight: "regular",
                fontStyle: "italic",
              }}
            >
              {postId ? postId.message : ""}
            </Box>
          )}
        </Grid>
        <Grid
          rowSpacing={10}
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              textAlign: "center",

              fontWeight: "regular",
              fontStyle: "italic",
              marginTop: "23%",
            }}
          >
            I have account{" "}
            <Box component={Link} to="/login">
              login
            </Box>{" "}
            here!
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignUp;
