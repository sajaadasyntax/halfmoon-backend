express = require("express");
const router = express.Router();
const {
  createProduct,
  
  getUserProducts,
  getUserProduct,
  getRate,
  getMBokDetails,
} = require("../controllers/products.controller");
const { upload } = require('../middlewares/upload');

const { authMiddleware } = require("../middlewares/authMiddleware");
router.post("/Products",authMiddleware ,upload.single('ID'),createProduct);
router.get("/Products" ,authMiddleware, getUserProducts);
router.get("/Products/:id", authMiddleware ,getUserProduct);



module.exports = router;
