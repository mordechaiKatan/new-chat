import "./Users.css"
import {useState,useEffect} from "react";
import axios from "axios";

let Users = ({setPartner, setShowUsers, theName})=> {

    const [users, setUsers]=useState();
    const [text,setText]=useState("Loading users...");

    useEffect(()=> {
        axios.get("/api/users")
        .then ((res)=> {
            setUsers(res.data);
            if (!res.data || res.data.length<2){
                console.log("moishale")
                setText("No users")}
        })
    },[])

    let chooseUser = (user)=> {
        setPartner(user);
        setShowUsers(false)
    }

    return (
        <div className="user-content">
        {users && 
        users.length>1 ? users.map((user)=>{
            if (user.userName!==theName){
                return (
                <div
                    key={user.userId}
                    className="user-name"
                    onClick={()=>chooseUser(user.userName)}
                >
                {user.userName}
                </div>)
            }
        }) : <div>{text}</div>
        }
        </div>
    )
}

export default Users;