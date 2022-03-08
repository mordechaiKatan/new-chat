import "./MessageItem.css"

let MessageItem = ({msg})=> {
    return (
        <>
            {msg && <div className="message-item">
                <div className="name">{msg.fullName}</div>
                <div>{msg.newMessage}</div>
            </div>}
        </>
    )
}

export default MessageItem