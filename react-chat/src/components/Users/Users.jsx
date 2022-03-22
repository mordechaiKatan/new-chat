import "./Users.css"
import {useState,useEffect} from "react";
import axios from "axios";

let Users = ({setPartner, setShowUsers, theName})=> {

    const [users, setUsers]=useState();
    const [searchUsers,setSearchUsers]=useState();
    const [text,setText]=useState("Loading users...");
    const [search,setSearch]=useState();

    useEffect(()=> {
        axios.get("/api/users")
        .then ((res)=> {
            setUsers(res.data);
            setSearchUsers(res.data);
            if (!res.data || res.data.length<2){
                console.log("moishale")
                setText("No users")}
        })
    },[])

    useEffect(()=>{
        if (search) {
           let rex = new RegExp(`^${search}`,"gi");
           let newUsers = users.filter((e)=> rex.test(e.userName))
           setSearchUsers(newUsers);
        }
         else {
            setSearchUsers(users);
        }
    },
    [search])

    let chooseUser = (user)=> {
        setPartner(user);
        setShowUsers(false)
    }

    return (
        <div className="user-content">
        
        {(users && users.length>1)
        ?
        <input
            className="search-input"
            placeholder="Search a partner"
            onChange={(e)=>setSearch(e.target.value)}
        />
        : <div>{text}</div>
        } 
        {searchUsers &&             
        searchUsers.map((user)=>{
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
        })}
        
        </div>
    )
}

export default Users;