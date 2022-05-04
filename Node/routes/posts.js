const router=require('express').Router();
const verify=require('./verifyToken');
const posts = require("../Model/post");
const User = require("../Model/user");
const multer=require('multer');
const path = require("path");
const { updateOne } = require('../Model/post');
const paginatedResults = require('./paginate');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const FilePath = path.join(__dirname, "../images/");
      cb(null, FilePath);
    },
    filename: (req, file, cb) => {
      console.log(file);
      const FileName =file.originalname;
      cb(null, FileName);
    },
  });
  var upload = multer({ storage: storage });
  router.post("/upload", upload.single("image"), async (req, res) => {
    res.send(req.file)
  });


  router.post("/AddFeed", upload.single("image"),async (req, res) => {
    const pos = new posts({
      image: req.body.image,
      title:req.body.title,
      path:req.body.path,
      userId:req.body.userId,
      userfirstName:req.body.userfirstName,
        likes:[],
        comments:[]
         });
      try {
        const saveduser = await pos.save();
        res.send(saveduser);
      } catch (err) {
        res.status(400).send(err);
      }
  });

router.get('/feed',verify,paginatedResults(posts),async (req,res)=>{
  const data=res.paginatedResults;
  try {

  // const pos=await posts.find();
  res.json(data);
} catch (err) {
  res.json({ message: err });
}
})

router.put('/feed/:id',async (req,res)=>{
  try{
   
    const updates=await posts.updateOne({_id:req.params.id},{$set:{comments:req.body.comments}})
    res.json(updates)
  }catch(e)
  {
  res.json({ message: e });

  }
})
router.put('/feed/likes/:id',async (req,res)=>{
  try{
   
    const updates=await posts.updateOne({_id:req.params.id},{$set:{likes:req.body.likes}})
    res.json(updates)
  }catch(e)
  {
  res.json({ message: e });

  }
})
module.exports=router;