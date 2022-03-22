import {useState, useEffect} from "react"
import "./Chat.css"
import socketClient  from "socket.io-client";
import MessageItem from "../MessageItem/MessageItem";
import Modal from "../Modal/Modal";
import axios from 'axios';
import icon from "../Chat/icons/arrow2.png"
import icon2 from "../Chat/icons/garbage.png";
import xicon from "../Chat/icons/xicon.png";
import searchIcon from "../Chat/icons/search.png";
import Users from "../Users/Users";

let Chat = ()=>{
  
  const [theName,setTheName] = useState();
  const [theId,setTheId] = useState();
  const [value,setValue]=useState("");
  const [showModal,setShowModal] = useState(false);
  const [showUsers,setShowUsers] = useState(false);
  const [partner,setPartner] = useState("");
  const [channel,setChannel] = useState([]);
  const [channel2,setChannel2] = useState([]);
  const [channelId,setChannelId] = useState();
  const [privateMsg,setPrivateMsg] = useState();  

  useEffect(()=> {    
    let socket = socketClient ("/");     
    socket.on("getId", (data)=>{localStorage.setItem("socketId",data); setTheId(data)});
    socket.on("private message", (data, msg)=>{
        setPrivateMsg(msg);        
    });
  },[])
  
  useEffect(()=>{
    let nameFromStorage = localStorage.getItem("name");
    !nameFromStorage ? setShowModal(true) : setTheName(nameFromStorage)
  },[])

  useEffect (()=> {
    if (theName && theId)
    {
      axios.post("/api/saveUser",
      {savedName: localStorage.getItem("name"),
      userId: theId}
    )}
  },[theName,theId])
  
  useEffect (()=>{
      if (channel) {
            channel.forEach((e,i)=>{
                if (e.fullName===theName){
                    e.fullName="אני"
                }         
            })
            setChannel2(channel)
            console.log(channel)
        }         
    }
  ,[channel])
   
  useEffect(()=>{
    if (privateMsg){
        if (privateMsg.channelId===channelId)
            {setChannel([privateMsg,...channel])}
    }
  }
   ,[privateMsg])
   
  useEffect(()=> {
        if (partner) {
        axios.get("/api/getChannel",
        {params:
            {receiver: partner,
            sender:  localStorage.getItem("name")}
            })
        .then ((res)=>{
                setChannel(res.data.messages);
                setChannelId(res.data._id);
        })
        }
    }
    ,[partner])

    let handleKeyDown = (e)=> {if (e.key === 'Enter' && value) {sendMessage()}}

    function sendMessage () {
        if (partner){
            axios.post("/api/addMessage", {
                receiver: partner,
                sender: {
                    userId: localStorage.getItem("socketId"),
                    userName: localStorage.getItem("name")
                    },
                msg: value
            })
            let newMsg= {fullName: localStorage.getItem("name"),newMessage: value}
            setChannel([newMsg, ...channel]);
        }
        setValue("");
      }

    function clear () {
        setChannel([]);
    }

    function disableInput () {
        if (showModal || showUsers || !partner)
        {return true}
    }

    return (
        <div className="chat-app2">

            <div className="header">
                <img
                    className="search-img"
                    src={searchIcon}
                    onClick={()=>setShowUsers(!showUsers)}/>
            </div>
            
            {partner &&
                <div className="partnerName">{partner}</div>
            }

            {showUsers && 
            <div className="users">
                <Users
                    setShowUsers={setShowUsers}
                    setPartner={setPartner}
                    theName={theName}
                />
            </div>}
            
            {showModal &&
            <div className="modal">
                <Modal
                    setTheName={setTheName}
                    setShowModal={setShowModal}
                />
            </div> }
            
            <div className="list-message2">
               {channel2 &&
               channel2.map((msg, index)=> 
                <MessageItem
                    key={index}
                    msg={msg}
                    theName={theName}/>)}
            </div>
            
            <div className="futer" >
                {value
                ? <img className="chat-img" src={icon} onClick={sendMessage}/>
                : <img className="chat-img" src={xicon}/>}
                
                <input
                    className="chat-input"
                    value={value}
                    onChange={(e)=>setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disableInput()}
                    ></input>

                <img
                    className="chat-img"
                    src={icon2}
                    onClick={clear}
                    />
            </div>

        </div>
    )
}

export default Chat