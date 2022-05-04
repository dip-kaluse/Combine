const router = require("express").Router();
const User = require("../Model/user");
const verify = require("./verifyToken");
const Joi = require("joi");
const http = require("http");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const passwordComplexity = require("joi-password-complexity");
const { OAuth2Client } = require("google-auth-library");
const e = require("express");
const client = new OAuth2Client(process.env.CLIENT_ID);
const complexityOptions = {
  min: 6,
  max: 250,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required().email(),
  password: passwordComplexity(complexityOptions),
});

router.post("/signup", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error)
    return res.json({ status: false, error: error.details[0].message });
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    name: req.body.firstName + " " + req.body.lastName,
    bio: "",
    gender: "",
    DOB: "",
    email: req.body.email,
    contact: "",
    password: req.body.password,
    profile: "",
  });
  try {
    const saveduser = await user.save();
    res.send(saveduser);
  } catch (err) {
    res.status(400).send(err);
  }
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const FilePath = path.join(__dirname, "../images/Profile");
    cb(null, FilePath);
  },
  filename: (req, file, cb) => {
    const FileName = file.originalname;
    cb(null, FileName);
  },
});
var upload = multer({ storage: storage });
router.post("/Profileupload", upload.single("image"), async (req, res) => {
  res.send(req.file);
});

router.put("/EditProfile/:id", async (req, res) => {
  try {
    const updates = await User.findByIdAndUpdate(req.params.id, req.body);
    const updatess = await User.updateOne(
      { _id: req.params.id },
      { $set: { profile: req.body.profile } }
    );
    res.json(updates);
  } catch (e) {
    res.json({ message: e });
  }
});

router.get("/users", async (req, res) => {
  try {
    const posts = await User.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/Change/:id", async (req, res) => {
  try {
    const updates = await User.updateOne(
      { _id: req.params.id },
      { $set: { password: req.body.password } }
    );
    res.json(updates);
  } catch (e) {
    res.json({ message: e });
  }
});

router.post("/GoogleLogin", async (req, res) => {
  try {
    const posts = await User.findOne({
      email: req.body.email,
    });
    if (!posts) return res.json({ status: false, error: "User is Not Exist" });
    const token = jwt.sign({ id: posts._id }, process.env.TOKEN_SECRET, {
      expiresIn: "10h",
    });
    res.setHeader("auth-token", token);
    const {
      email,
      firstName,
      lastName,
      password,
      bio,
      gender,
      DOB,
      name,
      profile,
      _id,
    } = posts;
    let p = {
      _id: _id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      token: token,
      bio: bio,
      gender: gender,
      DOB: DOB,
      name: name,
      profile: profile,
    };
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});

const schemas = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
router.post("/login", async (req, res) => {
  try {
    const { error } = schemas.validate(req.body);
    if (error)
      return res.json({ status: false, error: error.details[0].message });
    const posts = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!posts)
      return res.json({ status: false, error: "Password is not valid" });
    const token = jwt.sign({ id: posts._id }, process.env.TOKEN_SECRET, {
      expiresIn: "10h",
    });
    res.setHeader("auth-token", token);
    const {
      email,
      firstName,
      lastName,
      password,
      bio,
      gender,
      DOB,
      name,
      profile,
      _id,
    } = posts;
    let p = {
      _id: _id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      token: token,
      bio: bio,
      gender: gender,
      DOB: DOB,
      name: name,
      profile: profile,
    };
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
