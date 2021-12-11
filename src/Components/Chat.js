import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const Chat = ({ connection }) => {
  // auth state from redux store
  const authState = useSelector((state) => state.auth);

  const [chats, setChats] = useState([]); //either group or friend
  const [message, setMessage] = useState("");
  const [data, setDate] = useState(null);

  var configTemp = {
    headers: {
      'access-token': authState.accessToken
    }
  };

  useEffect(() => {
    //get chats
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
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="bg-secondary bg-opacity-75 overflow-auto chatNav d-flex flex-column">
      {console.log(connection._id, chats)}
      <div className="bg-secondary py-3 px-3 text-warning">
        <h3>{connection.friendsData.first_name + " " + connection.friendsData.last_name}</h3>
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
                    <div className="text-end d-inline-block"><sub className="px-2">{getTime(chat.timestamp)}</sub></div>
                    {/* <span className="float-end border border-danger"><sub className="px-2">{getTime(chat.timestamp)}</sub></span> */}
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