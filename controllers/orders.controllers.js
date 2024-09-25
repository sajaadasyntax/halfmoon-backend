const { Orders } = require("../models/orders");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");



const getUserOrder = asyncHandler(async (req, res) => {
  try {  
    const { id } = req.params;
    const ord = await Orders.findById(id);
    res.status(200).json(ord);
  } catch (error) {
    res.status(500).send({ message: "Order not found" });
  }
});


const getUserOrders = asyncHandler(async (req, res) => {
  try {  const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });
    const ord = await Orders.find({senderID : user?.id});
    res.status(200).json(ord);
  } catch (error) {
    res.status(404).send({ message: "Orders not found" });
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const fileName = req.file.path;
  console.log(req.file.path);
  const basePath = `${req.protocol}://${req.get('host')}/`;
  const cookies = req.cookies;
if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");
const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });

  const ord = new Orders({
    ordersList: req?.body?.ordersList,
    pricesList: req?.body?.pricesList,
    userID: req?.body?.userID,
    totalAmount: req?.body?.totalAmount,

  });

  try {
    await ord.save();
    res.send(ord);
  } catch (error) {
    res.status(500).send(error);
  }
});



module.exports = {
  getUserOrder,
  createOrder,
  getUserOrders
};
