const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// view engine setup start
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// view engine setup end

var storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'upload');
    },
    filename: function (_req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});

const maxSize = 1 * 1000 * 1000;

let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(`Error: file upload only support the flowing file type`, filetypes);
    }
}).single('uploadFile');



// route start

app.get('/', (req, res) => {
    res.render('signUp');
})

app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('file Upload successfully');
        }
    })
})

// route end

app.listen(8080, () => {
    console.log(`server run on 8080 port`)
})
