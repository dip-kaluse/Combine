import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleLogin from "react-google-login";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleLogIn = async (e) => {
    let payload = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:3000/login", payload)
      .then((res) => {
        if (!email || !password)
          return setError("Password and Email Can not be Empty!!");
        if (res.data.status !== false) {
          if (res !== "User Not Exist" && res.data.token !== "undefined") {
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("token", JSON.stringify(res.data.token));
            setError("Login Successfully !!");
            setOpen(true);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        } else {
          setError(res.data.error);
          setOpen(true);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (
      localStorage.getItem("user") !== null &&
      localStorage.getItem("token") !== null
    ) {
      navigate("/");
    }
  }, []);
  const loginwithgoogle = (res) => {
    console.log("success", res);
    axios
      .post("http://localhost:3000/GoogleLogin", { email: res.Lu.Bv })
      .then((res) => {
        console.log(res);
        if (res.data.status !== false) {
          if (res !== "User Not Exist" && res.data.token !== "undefined") {
            setError("");
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("token", JSON.stringify(res.data.token));
            navigate("/");
          }
        } else {
          setError(res.data.error);
        }
      });
  };
  return (
    <Container>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={error !== "Login Successfully !!" ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Grid
        item
        container
        xs={12}
        component="main"
        sx={{
          width: "50vh",
          height: "80vh",
          padding: "5vh",
          marginTop: "4%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "2px solid",
          borderColor: "secondary.main",
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
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
              variant="h4"
            >
              <b> AM SOCIAL</b>
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
              size="small"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              label="email"
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
              size="small"
              required
              name="password"
              label="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
              id="password"
              // autoComplete="current-password"
              error={false}
              sx={{ minWidth: "80%", marginBottom: "10%" }}
            />
          </Grid>
        </Grid>
        <Grid container rowSpacing={1}>
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
              onClick={(e) => handleLogIn(e)}
              variant="contained"
              sx={{ minWidth: "50%" }}
            >
              LogIn
            </Button>
          </Grid>

          <Grid
            rowSpacing={2}
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              sx={{
                textAlign: "center",
                m: 1,
                fontWeight: "regular",
                fontStyle: "italic",
                marginTop: "20%",
              }}
            >
              Dont have account{" "}
              <Box component={Link} to="/signup">
                signup
              </Box>{" "}
              here!
            </Box>
          </Grid>
        </Grid>
        <Grid
          // rowSpacing={2}
          xs={12}
          item
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <GoogleLogin
            clientId={
              "258096711456-f6igfuafn2n9c5s14ch12tos4vag8jmj.apps.googleusercontent.com"
            }
            onSuccess={loginwithgoogle}
            onFailure={(e) => console.log(e)}
          />
        </Grid>

        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {token != "" && (
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
              {token ? "" : ""}
            </Box>
          )}
          {
            <Box
              color="red"
              sx={{
                textAlign: "center",
                m: 1,
                textTransform: "lowercase",
                fontWeight: "regular",
                fontStyle: "italic",
              }}
            ></Box>
          }
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
}

export default LogIn;
