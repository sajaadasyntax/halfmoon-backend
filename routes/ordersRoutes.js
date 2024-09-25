express = require("express");
const router = express.Router();
const {
  createOrder,  
  getUserOrders,
  getUserOrder,

} = require("../controllers/orders.controllers");
const { upload } = require('../middlewares/upload');

const { authMiddleware } = require("../middlewares/authMiddleware");
router.post("/Orders",authMiddleware ,upload.single('ID'),createOrder);
router.get("/Orders" ,authMiddleware, getUserOrders);
router.get("/Order/:id", authMiddleware ,getUserOrder);



module.exports = router;
