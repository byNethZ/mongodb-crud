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
app.post('/', async (req, res) => {
    console.log(req.body, 'post data');

    //verify data from database with email
    //const chkdataexit = await userModel.findOne({uemail:req.body.email});
    const chkdataexit = await userModel.findOne({ $or:[{uemail:req.body.email},{umobile:req.body.mobile}] });
    if(chkdataexit){
        //email exists
        if(chkdataexit.uemail === req.body.email){
            res.send({
                msg: 'email id already exists'
            })
        }
        else{
            //mobile number exists
            res.send({
                msg: 'mobile number already exists'
            });
        }
    }
    else{
        //email doesn't exists

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
    }
})

//read data
app.get('/', async (req, res)=>{
    console.log('getData');
    
    const data = await userModel.find();

    if(data){
        res.send({
            msg: 'all user data',
            result: data
        })
    }
    else{
        res.send({
            msg: 'No data'
        });
    }
})

//get data by id
app.get('/:id', async (req, res)=>{
    console.log(req.params.id, 'ids');
    if(req.params.id){

        //verify format id on url
        const chkId = mongoose.isValidObjectId(req.params.id);
        if(chkId){
            const idData = await userModel.findById({_id:req.params.id})
            if(idData){
                res.send({
                    msg: 'single data by Id',
                    result: idData
                })
            }
            else{
                console.log(idData, 'idData');
                res.send({
                    msg: 'Single data not found',
                })
            }
        }
        else{
            res.send({
                msg: 'Invalid id format'
            })
        }

    }
})

//delete data by Id
app.delete('/:id', async (req, res) => {
    let id = req.params.id;
    console.log('remove data by id', id);

    const chkvalidId = mongoose.isValidObjectId(id);
    if(chkvalidId){
        const idData = await userModel.remove({_id: id})
        if(idData){
            res.send({
                msg: 'data removed successful',
                dataRemoved: idData
            })
        }
        else{
            console.log(idData);
            res.send({
                msg: 'Id no exists'
            })
        }
    }
    else{
        res.send({
            msg: 'Invalid format id'
        });
    }
})

//update data by id
app.put('/:id', async (req, res) => {
    let id = req.params.id;

    const updateData = await userModel.updateOne({_id:id}, {$set:{uemail:req.body.email}});
    if(updateData){
        res.send({
            msg: 'Data updated',
            dataUpadted: updateData
        })
    }
    else{
        res.send({
            msg: 'Id invalid'
        })
    }
})

//run server
const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
  console.log(`serve running on port ${PORT}`);
});
