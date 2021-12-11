import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const Chat = ({ connection, setConnection, socket }) => {
  // auth state from redux store
  const authState = useSelector((state) => state.auth);

  const [chats, setChats] = useState([]); //either group or friend
  const [message, setMessage] = useState("");

  var configTemp = {
    headers: {
      'access-token': authState.accessToken
    }
  };

  const getMessages = () => {
    let config = { ...configTemp };
    config.method = 'GET';
    config.url = process.env.REACT_APP_SERVER_URL + '/chats/' + connection._id;
    axios(config).then((response) => {
      // console.log(response);
      if (response.data.error) {
        console.log(response.data.error);
        setChats([]);
      } else if (response.data && Array.isArray(response.data)) {
        setChats([...response.data]);
      } else {
        setChats([]);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  socket.on(connection._id, () => {
    console.log("new message");
    getMessages();
  })

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, [connection]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const getDate = (timestamp) => {
    let date = new Date(timestamp);
    return date.toLocaleDateString('en-IN');
  }

  const getTime = (timestamp) => {
    let date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {timeStyle: 'short'});
  }

  const sendMessage = (e) => {
    if (!message) {
      return;
    }
    let config = { ...configTemp };
    config.method = 'POST';
    config.url = process.env.REACT_APP_SERVER_URL + '/chats';
    config.data = {
      connectionId: connection._id,
      message: {
        from: authState.userEmail,      
        to: connection.friendsData.email,
        message: message,
        timestamp: new Date()
      }
    };
    setMessage("");

    axios(config).then((response) => {
      // console.log(response);
      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        console.log(response.data.success)
        
        //notify receiver via server
        socket.emit("message", connection._id);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="bg-secondary bg-opacity-75 overflow-auto chatNav d-flex flex-column">
      {/* {console.log(connection._id, chats)} */}
      <div className="bg-secondary py-3 px-3 text-warning">
        <button className="btn btn-danger rounded-circle btn-sm d-inline-block float-start">
          <i className="bi bi-arrow-left my-auto" onClick={() => { setConnection(null) }}></i>
        </button>
        <h3 className="ms-3 d-inline-block">{connection.friendsData.first_name + " " + connection.friendsData.last_name}</h3>
      </div>
      <div className="pt-2 px-2 overflow-auto">
        {
          (chats && Array.isArray(chats)) ? (
            chats.map((chat, index) => (
              <div key={index}>
                {
                  <>
                  {/* display date */}
                  { 
                    (index===0 || getDate(chats[index-1].timestamp) !== getDate(chat.timestamp)) ? (
                      <div className="date mx-auto px-2 py-1">{getDate(chat.timestamp)}</div>
                    ) : (<></>)
                  }
                  
                  <div className={"m-1 py-1 px-2 " + ((chat.from === authState.userEmail) ? "ms-auto sentMessage" : "me-auto receivedMessage")}>
                    <span>{chat.message}</span>
                    <div className="text-end d-inline-block me-auto"><small><sub className="ps-2 pe-1">{getTime(chat.timestamp)}</sub></small></div>
                  </div>
                  </>
                }
              </div>

            ))
          ) : (<></>)
        }
      </div>
      <div className="d-flex flex-row chatInputDiv m-1 mt-auto">
        <textarea className="form-control chatInput overflow-auto" value={message} onChange={handleChange} id="floatingTextarea" rows="1" autoFocus></textarea>
        <div>
          <button className="btn btn-dark rounded-circle ms-1" onClick={(e) => { sendMessage(e) }}><i className="bi bi-send-fill"></i></button>
        </div>
      </div>
    </div>
  );
}

export default Chat;