import * as React from "react";
import { useState, useRef } from "react";
import {
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Container,
  Grid,
  TextField,
  Typography,
  TextareaAutosize,
  Snackbar,
  Avatar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import PhoneTextField from "mui-phone-textfield";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Header from "./Header";
import ClearIcon from "@mui/icons-material/Clear";

import {
  DatePicker,
  LocalizationProvider,
  // AdapterDateFns,
} from "@mui/x-date-pickers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function EditProfile2() {
  const imageRef = useRef();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [valueDate, setValueDate] = React.useState(user.DOB);
  const [valuePhNO, setValuePhNo] = useState(user.contact); // The input value.
  const [country, setCountry] = useState("IN"); // The selected country.
  const [phoneNumber, setPhoneNumber] = useState(user.contact); // The PhoneNumber instance.
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [profile, setProfile] = useState(user.profile);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [message, setMassage] = useState("");
  const [status, setStatus] = useState("");
  let navigate = useNavigate();
  const onChange = ({ formattedValue, phoneNumber }) => {
    setValuePhNo(formattedValue);
    setPhoneNumber(phoneNumber);
  };

  const onCountrySelect = ({ country, formattedValue, phoneNumber }) => {
    setValuePhNo(formattedValue);
    setCountry(country);
    setPhoneNumber(phoneNumber);
  };
  React.useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
  }, []);

  const handle = async () => {
    let flag = false;
    users.map((d) =>
      d.email === user.email ? "" : d.email === email ? (flag = true) : ""
    );
    if (flag === false && email !== "") {
      if (valuePhNO.length === 11 || valuePhNO.length === 0) {
        let obj = {
          name: name,
          bio: bio,
          gender: gender,
          DOB: valueDate,
          email: email,
          contact: valuePhNO,
          profile: profile,
        };
        axios
          .put(`http://localhost:3000/EditProfile/${user._id}`, obj)
          .then((res) => console.log(res));
        user.name = name;
        user.bio = bio;
        user.gender = gender;
        user.DOB = valueDate;
        user.email = email;
        user.contact = valuePhNO;
        user.profile = profile;
        localStorage.setItem("user", JSON.stringify(user));
        setStatus("succes");
        setMassage("Profile Updated Successfully");
        setOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setStatus("error");
        setMassage("Phone Number is not valid");
        setOpen(true);
      }
    } else {
      setStatus("error");
      setMassage("Email is already registered or Email is Required");
      setOpen(true);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

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
    <>
      {user && (
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
              xs={12}
              style={{
                marginTop: "2vh",
                border: "1px solid",
                borderColor: "#9c27b0",
                padding: "3vh",
              }}
            >
              <Grid
                xs={6}
                md={12}
                container
                direction="column"
                justifyContent="flex-end"
                alignItems="center"
              >
                {profile !== "" ? (
                  <ClearIcon
                    onClick={() => {
                      imageRef.current.value = null;
                      setProfile("");
                    }}
                  />
                ) : (
                  ""
                )}
                {profile === "" ? (
                  <Avatar
                    {...stringAvatar(user.firstName)}
                    sx={{ width: 150, height: 150, fontSize: "500%" }}
                  />
                ) : (
                  <Avatar
                    alt={name}
                    src={require(`../../../../Node/images/${profile}`)}
                    sx={{ width: 150, height: 150 }}
                  />
                )}
                <Grid
                  xs={6}
                  md={4}
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                  style={{ marginTop: "2vh" }}
                >
                  {" "}
                  <input
                    ref={imageRef}
                    type="file"
                    style={{ backgroundColor: "#e3f2fd" }}
                    onChange={(e) => {
                      setProfile(e.target.files[0].name);
                      let formData = new FormData();
                      formData.append("image", e.target.files[0]);
                      axios
                        .post("http://localhost:3000/Profileupload", formData)
                        .then((res) => console.log(res));
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: "4vh" }}
              >
                <Grid xs={4}>
                  <TextField
                    required
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                    id="fname"
                    type="text"
                    error={false}
                    label="Name"
                    name="fname"
                    value={name}
                    autoComplete="fname"
                    autoFocus
                    sx={{ minWidth: "80%", textAlign: "center" }}
                  />
                </Grid>
                <Grid xs={4}>
                  {" "}
                  <TextField
                    required
                    size="small"
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    value={email}
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    sx={{ minWidth: "80%", textAlign: "center" }}
                  />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: "4vh" }}
              >
                <Grid
                  xs={4}
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date Of Birth"
                      value={valueDate}
                      onChange={(newValue) => {
                        setValueDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          {...params}
                          style={{ width: "80%" }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={4}>
                  <PhoneTextField
                    style={{ width: "80%" }}
                    size="small"
                    label="Phone number"
                    defaultValue={valuePhNO}
                    country={country}
                    onCountrySelect={onCountrySelect}
                    onChange={onChange}
                  />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: "4vh" }}
              >
                <Grid
                  xs={4}
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  {" "}
                  <Grid
                    xs={6}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    style={{ marginTop: "4vh" }}
                  >
                    <Typography
                      sx={{ ml: 10 }}
                      gutterBottom
                      variant="h6"
                      component="div"
                    >
                      Gender
                    </Typography>
                  </Grid>
                  <Grid
                    xs={6}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                  >
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        // value={value}
                        onChange={(e) => setGender(e.target.value)}
                        defaultValue={user.gender}
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid xs={4}>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={4}
                    placeholder="Bio"
                    value={bio}
                    style={{ width: "80%", backgroundColor: "#e3f2fd" }}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: "4vh" }}
              >
                {" "}
                <Grid
                  xs={4}
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                >
                  <Button
                    type="submit"
                    onClick={(e) => handle(e)}
                    variant="contained"
                    sx={{ maxWidth: "50%", maxHeight: "50%" }}
                  >
                    Sumbit
                  </Button>
                </Grid>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Grid
                  xs={5}
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Button
                    type="submit"
                    color="error"
                    onClick={() => navigate("/")}
                    variant="contained"
                    sx={{ maxWidth: "50%", maxHeight: "50%" }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}

export default EditProfile2;
