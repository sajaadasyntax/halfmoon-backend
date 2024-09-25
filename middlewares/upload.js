const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    // Specify the upload directory
    cb(null, './uploads');
    },
    filename: function (req, file, cb) {
    // Define the file name format
    cb(null, Date.now() + "-" + file.originalname);
    }
   });

   fileFilter = (req, file, callback) => {
   
   
    const validExts = [".png", ".jpg", ".jpeg"];


   if (!validExts.includes(path.extname(file.originalname))) {
   return callback(new Error("only one of " + validExts + " format allowed"));
   }

   const fileSize = parseInt(req.headers['content-length'])
   if (fileSize > 1048576) {
   return callback(new Error("file size is Big"));
   }
    callback(null, true);
   
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 1048576, //10MB
})

module.exports = { upload };