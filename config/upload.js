import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp');
    },
});

const upload = multer({ storage: storage });

export default upload;