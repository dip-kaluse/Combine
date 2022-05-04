import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FileUpload from "react-material-file-upload";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function AddFeed() {
  const [filename, setFilename] = useState("");
  const [filepath, setFilepath] = useState("");
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  let navigate = useNavigate();
  const [image, setImage] = useState("");

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
      navigate("/");
    }
    console.log(filepath, filename, title);
  };

  // console.log(files);
  return (
    <div>
      {/* <Header /> */}
      <center>
        <Grid
          item
          container
          xs={12}
          component="main"
          sx={{
            // width: "0vh",
            // height: "60vh",
            padding: "2vh",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h3>Add Feeds Here</h3>
            </Grid>
            <Grid item xs={7}>
              <TextField
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
              // item
              container
              xs={3}
              direction="column"
              justifyContent="center"
              alignItems="flex-end"
            >
              {image !== "" && (
                <img src={require(`../../../../Node/images/${image}`)}></img>
              )}
              <input
                type="file"
                style={{ fontSize: "80%", marginLeft: 50 }}
                onChange={(e) => {
                  console.log(e.target.value);
                  setImage(e.target.value);
                  setFilename(e.target.files[0].name);
                  setFilepath(e.target.value);
                  let formData = new FormData();
                  formData.append("image", e.target.files[0]);
                  axios
                    .post("http://localhost:3000/api/upload", formData)
                    .then((res) => console.log(res));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" onClick={handle}>
                Post
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </Grid>
          </Grid>
        </Grid>
      </center>
    </div>
  );
}

export default AddFeed;
