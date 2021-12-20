import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const ChatList = ({ setConnection }) => {
  // auth state from redux store
  const authState = useSelector((state) => state.auth);
  // socket state from redux store
  const socket = useSelector((state) => state.socket.socket);

  const [connections, setConnections] = useState([]); //list of friends and groups

  var config = {
    headers: {
      'access-token': authState.accessToken
    }
  };

  const getFriends = () => {
    try {
      config.method = 'GET';
      config.url = process.env.REACT_APP_SERVER_URL + '/friends';
      axios(config).then(response => {
        if (response.data.error) {
          console.log(response.data.error);
        } else if (response.data && Array.isArray(response.data)) {
          setConnections([...response.data]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getFriends();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("friend-added", () => {
        getFriends();
      });
    }
    // eslint-disable-next-line
  }, [socket]);

  return (
    <div className="h-100 bg-secondary bg-opacity-25 border border-white rounded overflow-auto chatNav">
      {
        (connections && Array.isArray(connections) && connections.length > 0) ? (
          connections.map(connection => (
            <button key={connection._id} className="btn btn-outline-light w-100 py-3"
              onClick={() => { setConnection(connection) }}>{connection.friendsData.first_name + " " + connection.friendsData.last_name}</button>
          ))
        ) : (<p className='text-white text-center p-5 m-5'>Your Friendlist is empty.<br/><br/> Click on "Add Friend" in the Navbar to send Friend Requests. <br/><br/>You can start chatting once your friend accepts your friend request</p>)
      }
    </div>
  );
}

export default ChatList;