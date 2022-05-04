import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  let navigate = useNavigate();
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
          .then((res) => console.log(res));
        navigate("/");
      } else alert("Old password is not matching!!!");
    } else {
      alert("New Password And Confirm Password should be same!!!");
    }
  };

  return (
    <Container>
      <Grid xs={12}>
        <Grid
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Header></Header>
        </Grid>
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
              placeholder="Current Password"
              type="password"
              autoComplete="current-password"
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
              placeholder="New Password"
              type="password"
              autoComplete="current-password"
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
              placeholder="Confirm Password"
              type="password"
              autoComplete="current-password"
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
              onClick={() => navigate("/")}
              variant="contained"
              sx={{ maxWidth: "50%", maxHeight: "90%" }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChangePassword;
