import * as React from "react";
import { useState } from "react";
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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import PhoneTextField from "mui-phone-textfield";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Header from "./Header";
import DeleteIcon from "@mui/icons-material/Delete";
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
function EditProfile() {
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
              item
              container
              xs={12}
              component="main"
              sx={{
                width: "100%",
                height: "90vh",
                padding: "1vh",
                marginTop: "1%",
                marginLeft: "auto",
                marginRight: "auto",
                border: "2px solid",
                borderColor: "secondary.main",
              }}
            >
              {" "}
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Profile Picture
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
                  <input
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
                  {profile !== "" ? (
                    <img
                      style={{ maxHeight: "20vh", height: "10vh" }}
                      src={require(`../../../../Node/images/${profile}`)}
                    />
                  ) : (
                    ""
                  )}
                  {profile !== "" ? (
                    <DeleteIcon
                      onClick={() => {
                        setProfile("");
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Name
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
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
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Bio
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
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
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Gender
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
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
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Date Of Birth
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date Of Birth"
                      value={valueDate}
                      onChange={(newValue) => {
                        setValueDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Email
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
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
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid xs={6} md={4} container justifyContent="flex-start">
                  <Typography
                    sx={{ ml: 10 }}
                    gutterBottom
                    variant="h6"
                    component="div"
                  >
                    Phone Number
                  </Typography>
                </Grid>
                <Grid xs={6} md={8}>
                  <PhoneTextField
                    size="small"
                    label="Phone number"
                    error={Boolean(
                      valuePhNO.length == !11 &&
                        valuePhNO &&
                        phoneNumber?.country !== country
                    )}
                    defaultValue={valuePhNO}
                    country={country}
                    onCountrySelect={onCountrySelect}
                    onChange={onChange}
                  />
                </Grid>
              </Grid>
              <Grid xs={12} container justifyContent="center">
                <Button
                  type="submit"
                  onClick={(e) => handle(e)}
                  variant="contained"
                  sx={{ maxWidth: "50%", maxHeight: "50%" }}
                >
                  Sumbit
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
        </Container>
      )}
    </>
  );
}

export default EditProfile;
