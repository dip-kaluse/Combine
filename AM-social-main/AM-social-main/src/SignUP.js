import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "react-google-login";
toast.configure();
function Log() {
  const navigate = useNavigate();
  const reRef = useRef();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(false);
  const [googleData, setGoogleData] = useState({
    idToken: "",
    reCaptchaToken: "",
  });
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const responseGoogle = async (response) => {
    const token = await reRef.current.executeAsync();
    console.log(token);
    setGoogleData({ idToken: response.tokenId, reCaptchaToken: token });
    reRef.current.reset();
    setCount(true);
    setGoogleData({
      idToken: "",
      reCaptchaToken: "",
    });
  };
  useEffect(() => {
    if (data.message !== undefined) {
      const completemsg = () => {
        toast.error(data.message, { autoClose: 2000 });
      };
      completemsg();
    }
  }, [data]);
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signInForm),
    };
    if (count) {
      fetch("https://admin.liveexamcenter.in/api/auth/login", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          localStorage.setItem("token", JSON.stringify(data));
          navigate("/home");
        });
      setCount(false);
    }
  }, [signInForm, count, navigate]);
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googleData),
    };
    if (count) {
      fetch("http://admin.liveexamcenter.in/api/auth/google", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          localStorage.setItem("token", JSON.stringify(data));
          navigate("/home");
        });
      setCount(false);
    }
  }, [count, googleData, navigate]);
  const signIn = async (e) => {
    e.preventDefault();
    const token = await reRef.current.executeAsync();
    setSignInForm({
      ...signInForm,
      reCaptchaToken: token,
    });
    setCount(true);
    reRef.current.reset();
    setSignInForm({
      email: "",
      password: "",
    });
  };
  return (
    <Container width="100vh" sx={{ textAlign: "center" }}>
      <div style={{ margin: "30px 0" }}>
        <img
          src={"http://admin.liveexamcenter.in/assets/images/logo.svg"}
          alt="Angular minds"
        />
      </div>
      <Grid
        container
        xs={12}
        component="main"
        sx={{ width: "130vh", marginLeft: "auto", marginRight: "auto" }}
      >
        <Grid
          item
          xs={6}
          sm={4}
          md={6}
          sx={{
            backgroundColor: "#4A86FF",
          }}
        >
          <img
            src="http://admin.liveexamcenter.in/assets/images/login.png"
            alt="log"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "center",
            }}
          />
        </Grid>
        <Grid item xs={6} sm={8} md={6} component={Paper}>
          <Grid
            container
            direction="column"
            justify="center"
            className="login-form"
            style={{ padding: "50px" }}
          >
            <Grid item>
              <Typography
                component="h3"
                variant="p"
                style={{ textAlign: "start" }}
              >
                Login to your account
              </Typography>
            </Grid>
            <Grid item>
              <form onSubmit={(e) => signIn(e)}>
                <Grid container direction="column" spacing={2}>
                  <Grid
                    item
                    style={{
                      textAlign: "start",
                      marginTop: "20px",
                      textIndent: "8px",
                    }}
                  >
                    {"Email address"}
                  </Grid>
                  <Grid item style={{ paddingLeft: "0px" }}>
                    <TextField
                      required
                      size="small"
                      id="email"
                      type="email"
                      error={false}
                      placeholder="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={signInForm.email}
                      onChange={(value) =>
                        setSignInForm({
                          email: value.target.value,
                          password: signInForm.password,
                        })
                      }
                      sx={{ minWidth: "100%" }}
                    />
                  </Grid>
                  <Grid
                    item
                    style={{
                      textAlign: "start",
                      marginTop: "20px",
                      textIndent: "8px",
                    }}
                  >
                    {"password"}
                  </Grid>
                  <Grid item style={{ paddingLeft: "0px" }}>
                    <TextField
                      size="small"
                      required
                      name="password"
                      placeholder="password"
                      type="password"
                      id="password"
                      value={signInForm.password}
                      autoComplete="current-password"
                      onChange={(value) =>
                        setSignInForm({
                          email: signInForm.email,
                          password: value.target.value,
                        })
                      }
                      error={false}
                      autoFocus
                      sx={{ minWidth: "100%" }}
                    />
                  </Grid>
                  <Grid
                    item
                    style={{
                      textAlign: "start",
                      marginTop: "20px",
                      textIndent: "8px",
                    }}
                  >
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ minWidth: "100%" }}
                    >
                      Sign In
                    </Button>
                  </Grid>
                  <Grid item>{"OR"}</Grid>
                  <Grid item>
                    <GoogleLogin
                      clientId="971623344603-0qquan9pcdb9iu7oq9genvpnel77i7oa.apps.googleusercontent.com"
                      buttonText="Log in with google"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={"single_host_origin"}
                      style={{ color: "black" }}
                    />
                  </Grid>
                  <ReCAPTCHA
                    sitekey="6Ld3COIZAAAAAC3A_RbO1waRz6QhrhdObYOk7b_5"
                    size="invisible"
                    ref={reRef}
                  />
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
