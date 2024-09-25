const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const { upload } = require('../middlewares/upload');


const CreateUser = asyncHandler(async (req, res) => {
  const mobile = req.body.mobile;
  console.log(req.body);

  console.log(req.body.mobile);
  const userExists = await User.findOne({ mobile });
  if (!userExists) {
    const newUser = await User.create({
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      password: req?.body?.password,
      mobile: req?.body?.mobile,

    });
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
});

const loginUserController = asyncHandler(async (req, res) => {
 const { mobile, password } = req.body;
 const findUser = await User.findOne({ mobile });
 if (findUser && (await findUser.isPasswordMatched(password))) {
  const refreshToken = await generateRefreshToken(findUser._id);
  const  updateuser = await User.findByIdAndUpdate(findUser.id, {refreshToken: refreshToken}, {new : true});
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000
  });
    res.json({
        id : findUser?.id,
        firstname : findUser?.firstname,
        lastname : findUser?.lastname,
        mobile : findUser?.mobile,
        email : findUser?.email,
        ImageUrl : findUser?.ImageUrl,
        token : generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
}); 


const handleRefrshToken = asyncHandler(async (req, res) => {
const cookies = req.cookies;
if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");
const refreshToken = cookies.refreshToken;
const user = await User.findOne({ refreshToken });
if (!user) throw new Error(" No refresh token in the database or not matched");
jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
  if (err || user.id !== decoded.id) {
     throw new Error ("There is something wrong with the refresh token");
  }
  const accessToken = generateToken(user?._id); 
  res.json({ accessToken });
});
});


const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");
  const RefreshToken = cookies.refreshToken;
  const user = await User.findOne({ RefreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure : true
    });
    return res.sendStatus(204);
  }
   await User.findOneAndUpdate(RefreshToken, { 
    refreshToken: "",
   });
   res.clearCookie("refreshToken", {
    httpOnly: true,
    secure : true
  });
  return res.sendStatus(204);

});

const getUser = asyncHandler(async (req, res) => {
  const {id} = req.user;
  validateMongodbid(id);
 try{
  const getuser = await User.findById(id);
  res.json(getuser);    
 } catch(error){
   throw new Error(error);
 }
});


const updateaUser = asyncHandler(async (req, res) => {
  const {id} = req.user;
  validateMongodbid(id);

 try{
  const updateduser = await User.findByIdAndUpdate(id,
      {
          firstname : req?.body?.firstname,
          lastname : req?.body?.lastname,
          email : req?.body?.email,
      },
    {
      new: true,
    });
  console.log(updateduser.firstname)
  res.json("user updated successfully");    
 } catch(error){
   throw new Error(error);
 }
});

 
module.exports = { CreateUser, loginUserController, handleRefrshToken, logout, getUser, updateaUser};
