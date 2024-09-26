import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});



// const fileFilterVideo = (req, file, cb) => {
//   if(file.mimetype === 'video/mp4'){
//       cb(null,true);
//   }else{
//       cb({message: 'Unsupported File Format'}, false)
//   }
// };


const upload = multer({ storage: storage });

export { upload };




