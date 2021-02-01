const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
var multer = require('multer')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        //console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});;
var upload = multer({ storage: storage });
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/car', db.getCars)
app.get('/car/:id', db.getCarById)
app.get('/carimage', db.carWithImage)
app.post('/car', db.addCar)
app.put('/car/:id', db.updateCar)
app.delete('/car/:id', db.deleteCar)
app.post('/uploadfile/:id', upload.single('carimage'), db.addCarImage)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})