import { useState } from "react";
import axios from "axios";
import "./Modal.css";
import v from "./v.png";

let Modal = ({setTheName, setShowModal})=> {

    const [checkedName,setCheckedName]=useState();
    const [nameMessage,setNameMessage]=useState();

    function addNameToStorage () {
        axios.post("/api/checkName", {
            checkedName: checkedName,
            userId: localStorage.getItem("socketId")    
        })
        .then ((res)=> {
            if (res.data) {
                localStorage.setItem("name",checkedName);
                setTheName(checkedName);
                setShowModal(false);
        }
            else {setNameMessage("The name already exists 🥺")}
        })
    }

    return (
        <div className="modal-content">
            <h4>What's your full name?</h4>
            <input className="modal-input" onChange={(e)=>setCheckedName(e.target.value)}></input>
            {nameMessage && <h4 style={{color:"red"}}>{nameMessage}</h4>}
            <img className="modal-img" src={v} onClick={addNameToStorage}/>
        </div>
    )
}

export default Modal;