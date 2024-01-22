const router = require("express").Router();
const User = require("../models/User");

// creating user

router.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    const user = await User.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if (e.code == 11000) {
      msg = "User already exists";
    } else {
      msg = e.message;
    }
    console.log(e)
    res.status(400).json(msg)
  }
});


// login user

router.post('/login', async(req, res) => {
  try{
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  }catch(e) {
    res.status(400).json(e.message);
  }
})

router.get('/', async(req, res)=> {
  try {
    const users = await User.find({ isAdmin: false });
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// EDIT PROFILE
router.patch("/edit", async (req, res) => {
  const {user_id, formData, picture} = req.body;

  try {
    const user = await User.findById(user_id);
    user.picture = picture;
    user.name = formData.name;
    user.dob_day = formData.dob_day;
    user.dob_month = formData.dob_month;
    user.dob_year = formData.dob_year;
    user.gender_identity = formData.gender_identity;
    user.mother_tongue = formData.mother_tongue;
    user.learning_languages = formData.learning_languages;
    user.about = formData.about;

    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
    console.log(e)
  }
});

// delete user
router.delete('/:id', async(req, res)=> {
  const {id} = req.params;
  const {admin_id} = req.body;
  try {
    const user = await User.findById(admin_id);
    if(!user.isAdmin) return res.status(401).json("You don't have permission");
    await User.findByIdAndDelete(id);
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

router.patch('/checkbanstatus', async(req, res) => {
  const {_id} = req.body;
  try{
    const user = await User.findById(_id);
    console.log(user)
    await user.save();

    res.status(200).json(user);
  }catch(e) {
    res.status(400).json(e.message);
  }
})

router.patch('/ban/:id', async(req, res)=> {
  const {id} = req.params;
  const {admin_id} = req.body;
  try {
    const checkUser = await User.findById(admin_id);
    if(!checkUser.isAdmin) return res.status(401).json("You don't have permission");
    const user = await User.findById(id);
    user.isBanned = "true";
    await user.save();
    const users = await User.find();
    res.status(200).json(user);
    console.log(user)
  } catch (e) {
    res.status(400).send(e.message);
  }
})

router.patch('/unban/:id', async(req, res)=> {
  const {id} = req.params;
  const {admin_id} = req.body;
  try {
    const checkUser = await User.findById(admin_id);
    if(!checkUser.isAdmin) return res.status(401).json("You don't have permission");
    const user = await User.findById(id);
    user.isBanned = "false";
    await user.save();
    const users = await User.find();
    res.status(200).json(user);
    console.log(user)
  } catch (e) {
    res.status(400).send(e.message);
  }
})

module.exports = router