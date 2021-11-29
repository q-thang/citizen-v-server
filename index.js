const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const auth = require('./middleware/auth')
require("dotenv").config();

db.connect();

// MIDDLEWARE
// middleware nay dung de lay duoc du lieu nhap tu req.body


// json() dung de parse req object thanh json object
app.use(express.json());


// urlencoded() dung de parse req object co the thanh nested object neu extended == true
app.use(express.urlencoded({ extended: false }));


app.use(cors());
// middleware duoi day co the su dung thay cho middleware built-in cors
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


// cookie-parser la 1 middleware dung de phan tich cu phap cookie
app.use(cookieParser());


// ROUTES
app.use("/api", require("./routes/authRouter"));
app.use(auth);
app.use("/api", require("./routes/unitRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/citizenRouter"));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
