

const express = require('express');

const AWS = require('aws-sdk');
require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');

const multer = require('multer');
const upload = multer({dest:"uploads/"});

const app = new express();
const User = require('./models/users');
const Userdata = require('./data/Userdata');
const date = require('date-and-time');
app.use(express.static('client'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})
  

app.get('/add', async (req, res) => {
    let client = new MongoClient(process.env.URI_1, { useNewUrlParser: true, useUnifiedTopology: true });
    const cn = await client.connect()
    const isConnected = await cn._eventsCount;
    if(isConnected){
        /*
        const db = await client.db("samuel");
        await db.collection("users").insertMany(Userdata)
        await client.close()
        .then(err2 => {
            
        })
        res.send("Connected")
        */
    }else{
        res.send("not connected")
    }
    
})

app.get('/data', async (req, res) => {

    let client = new MongoClient(process.env.URI_1, { useNewUrlParser: true, useUnifiedTopology: true });
    
    client.connect(async err => {
        const db = await client.db("samuel");
        const users = db.collection('users');
        const user = await users.findOne({email: "ad1@gmail.com"});
        if(user.email){
            const now = new Date();
            const pattern = date.compile('ddd, MMM DD YYYY, HH:mm:ss');
            const datef = date.format(now, pattern); 
            console.log(datef)
            await users.updateOne({email: user.email}, 
                {  
                   $inc: {"logs.views": 1},
                   $set: {"logs.visited": datef}
            },(error, result) => {
                if(error){
                    res.send("couldn't update data")
                    client.close()
                }else{
                    res.send("Action completed");
                    client.close();
                }
            });
        }
        if(err){
            console.log(err)
            client.close()
        }
    });
})


app.get('/comment/:add', async (req, res) => {

    let client = new MongoClient(process.env.URI_1, { useNewUrlParser: true, useUnifiedTopology: true });
    
    client.connect(async err => {
        const db = await client.db("samuel");
        const users = db.collection('users');
        const user = await users.findOne({email: "ad1@gmail.com"});
        if(user.email){
            const now = new Date();
            const pattern = date.compile('ddd, MMM DD YYYY, HH:mm:ss');
            const datef = date.format(now, pattern); 
            console.log(datef)
            const update = await users.updateOne({email: user.email}, 
                {  
                   $push: { comments: {word: "Just one newest comment", date: now} },
                   $inc: {"logs.views": 1},
                   $set: {"logs.visited": datef},
                   $unset: { comment: ""}
                }, (error, result) => {
                    if(error){
                        res.send("Couldn't update data");
                        console.log("F");
                        client.close();
                    }else{
                        res.send("Data updated");
                        console.log("T");
                        client.close();
                    }
                })
        }
        if(err){
            console.log(err)
            client.close()
        }
    });
})


let server = app.listen(8080, () => {
    console.log('Listening', server.address().port);
});