const multer = require('multer');
const path = require('path');

//Storage config 
 
const storage = multer.diskStorage({
    destination: function (req , file ,cb) {
        cb(null, "./uploads/") ; //Destination folder 
    },
    filename:  function (req , file ,cb) {
        cb(null, Date.now() +path.extname(file.originalname)) ; //Unique filename 
    },
});


//File Filter (img/vid)

const  fileFilter = (req , file , cb ) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null , true );
    } else {
        cb(new Error("Only images or videos allowed"), false );
    }
};

//Initialization multer instance 
const upload = multer ({ storage , fileFilter});

module.exports = upload;