const express = require("express")
const app = express();
const http = require('http').createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const { port } = require('./config');
const connect = require('./db');
const User= require('./models/User');
const Channel = require ('./models/Channel');
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    credentials: true
  }
});

app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname, 'react-chat/build')));

connect().then(() => {
  console.log('MONGO DB is connected');
  http.listen(port, () => {
    console.log('Server is up with express on port: ', port);
  });
});

io.on("connection", (socket) => {
  socket.emit ("getId",socket.id)}
  )

app.post("/api/checkName",async (req,res) => {
  const findUser = await User.findOne({userName:req.body.checkedName}).exec();
  if (!findUser){    
    res.send(true)
  } else {
    res.send(false)
  };  
})

app.post ("/api/saveUser", async (req,res)=> {  
  const findUser = await User.findOne({userName:req.body.savedName}).exec();
  if (findUser) {
    await findUser.updateOne(
      {userId:req.body.userId})
      .exec()
  } else {
      let newUser = new User({
        userName: req.body.savedName,
        userId:req.body.userId});
      await newUser.save();
  }
  res.send("User saved")
})

app.get("/api/getChannel", async (req,res)=> {
  let clientMsg=req.query;
  let channel= await Channel.findOne({
    participants:{$all:[clientMsg.sender,clientMsg.receiver]}
  }).exec();
  if (!channel) {
    let newChannel = new Channel ({
      participants: [clientMsg.sender, clientMsg.receiver],
      messages: []
    })
    await newChannel.save();
    res.send(newChannel)
  } else {res.send(channel)}
})


app.post("/api/addMessage", async (req,res) => {
  let clientMsg=req.body;
  let channel= await Channel.findOne(
    {participants:{$all:[clientMsg.sender.userName,clientMsg.receiver]}}
    ).exec();
  await channel.updateOne(
      {messages: [{ fullName: clientMsg.sender.userName,newMessage: clientMsg.msg}, ...channel.messages]}
      )
  res.send ("update channel success");

let channelId= channel._id;
let getReceiver= await User.findOne({userName:clientMsg.receiver}).exec();
let receiverId= getReceiver.userId;
io.to(receiverId).emit(
    "private message",
    clientMsg.sender.userId,
    {fullName: clientMsg.sender.userName,
      newMessage: clientMsg.msg,
      channelId: channelId });
})

app.get("/api/users", async (req,res)=>{
  let users = await User.find({}).exec();
  res.send (users)
})