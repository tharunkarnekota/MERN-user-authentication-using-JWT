const express = require('express');
const mongoose = require('mongoose');
const DBschema = require('./model')
const jwt = require('jsonwebtoken');

const app = express()

mongoose.connect('mongodb+srv://tharunkarnekota:tharunkarnekota@cluster0.91vtr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(
    ()=>{
    console.log('DB is connected..')
    }
)

app.use(express.json());

app.post('/register',async (req,res)=>{
    try{
        const {username,email,password,confirmpassword} = req.body;
        let exist = await DBschema.findOne({email})
        if(exist){
            return res.status(400).send('User Already Exist')
        }
        if(password !== confirmpassword){
            return res.status(400).send('passwords are not matching')
        }
        let newUser = new DBschema({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        return res.status(200).send('register succesfully')
      //return res.json(await DBschema.find())
      //res.status(200).json(await DBschema.find())      //both are same
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internal Server Error');
    }
})

app.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body;
        let exist = await DBschema.findOne({email});
        if(!exist){
            return res.status(400).send('user not found')
        }
        if(exist.password !== password){
            return res.status(400).send('Invalid credentials')
        }

        let payload ={
            user : {
                id : exist.id
            }
        }

        jwt.sign(payload,'jwtsecuritykey',{expiresIn:3600000},
            (err,token) =>{
                if (err) throw err;
                return res.json({token})
            }
            )
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.listen(5000,()=>{
    console.log('server is running..')
})