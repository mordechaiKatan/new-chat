import {useState, useEffect} from "react"
import "./Chat.css"
import socketClient  from "socket.io-client";
import MessageItem from "../MessageItem/MessageItem";
import Modal from "../Modal/Modal";
import axios from 'axios';
import icon from "../Chat/icons/arrow2.png"
import icon2 from "../Chat/icons/garbage.png";
import xicon from "../Chat/icons/xicon.png";
import Users from "../Users/Users";

let Chat = ()=>{
  
  const [theName,setTheName] = useState();
  const [theId,setTheId] = useState();
  const [value,setValue]=useState("");
  const [showModal,setShowModal] = useState(false);
  const [showUsers,setShowUsers] = useState(true);
  const [buttonText,setButtonText] = useState();
  const [partner,setPartner] = useState("");
  const [channel,setChannel] = useState([]);
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
    if (theName)
    {
      axios.post("/api/saveUser",
      {savedName: localStorage.getItem("name"),
      userId: theId}
    )}
  },[theName,theId])  
   
  useEffect(()=>{
    if (privateMsg){
        if (privateMsg.channelId===channelId)
            {setChannel([privateMsg,...channel])}
    }
  }
   ,[privateMsg])
   
  useEffect(()=> {
        if (showUsers) {setButtonText("Hide users")}
        else {if (partner) {setButtonText(partner)} else {setButtonText("Display users")}}
    },[showUsers])

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
            let newMsg= {newMessage: value, fullName: localStorage.getItem("name")}
            setChannel([newMsg, ...channel]);
        }
        setValue("");
      }

    function clear () {
        setChannel([]);
    }

    return (
        <div className="chat-app2">

            <div className="header">MY CHAT</div>

            <button
                className="menu-button"
                onClick={()=>setShowUsers(!showUsers)}>{buttonText}
            </button>

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
               {channel &&
               channel.map((msg, index)=>
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
                    disabled={showModal}
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