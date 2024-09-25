const { Products } = require("../models/products");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");



const getUserProduct = asyncHandler(async (req, res) => {
  try {  
    const { id } = req.params;
    const prod = await Product.findById(id);
    res.status(200).json(prod);
  } catch (error) {
    res.status(500).send({ message: "Product not found" });
  }
});


const getUserProducts = asyncHandler(async (req, res) => {
  try {  const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });
    const prod = await Products.find({senderID : user?.id});
    res.status(200).json(prod);
  } catch (error) {
    res.status(404).send({ message: "Products not found" });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const fileName = req.file.path;
  console.log(req.file.path);
  const basePath = `${req.protocol}://${req.get('host')}/`;
  const cookies = req.cookies;
if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");
const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });

  const prod = new Products({
    productName: req?.body?.productName,
    price: req?.body?.price,
    productImage:  `${basePath}${fileName}`,
    description: req?.body?.description,

  });

  try {
    await prod.save();
    res.send(prod);
  } catch (error) {
    res.status(500).send(error);
  }
});



module.exports = {
  getUserProduct,
  createProduct,
  getUserProducts
};
