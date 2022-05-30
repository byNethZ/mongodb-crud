require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

//require user model
const userModel = require('./models/users');

const app = express();

app.use(cors());
app.use(bodyParser.json());

//connect database
mongoose.connect(
  process.env.mongodburl,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log("Coonnection failed: " + err.message);
    } else {
      console.log("connection success");
    }
  }
);

//save or create data
app.post('/', (req, res) => {
    console.log(req.body, 'post data');

    const data = new userModel({
        uname: req.body.name,
        uemail: req.body.email,
        umobile: req.body.mobile,
    });

    data.save((err, result) =>{
        if(err){
            console.log('saved data fail');
        }
        else{
            res.send({
                msg: 'date save successful',
                data: result
            });
        }
    })
})

//run server
const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
  console.log(`serve running on port ${PORT}`);
});
