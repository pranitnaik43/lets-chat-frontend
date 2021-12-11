import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const ChatList = ({ setConnection }) => {
  // auth state from redux store
  const authState = useSelector((state) => state.auth);

  const [connections, setConnections] = useState([]); //list of friends and groups

  var config = {
    headers: {
      'access-token': authState.accessToken
    }
  };

  useEffect(() => {
    //get friends and groups
    try {
      config.method = 'GET';
      config.url = process.env.REACT_APP_SERVER_URL + '/groups';
      axios(config).then(response => {
        // console.log(response);
        if (response.data.error) {
          console.log(response.data.error);
        } else if (response.data && Array.isArray(response.data)) {
          setConnections([...response.data]);
        }
      });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-secondary bg-opacity-75 overflow-auto chatNav">
      {
        (connections && Array.isArray(connections) && connections.length > 0) ? (
          connections.map(connection => (
            <button key={connection._id} className="btn btn-outline-light w-100 py-3"
              onClick={() => { setConnection(connection) }}>{connection.friendsData.first_name + " " + connection.friendsData.last_name}</button>
          ))
        ) : (<></>)
      }
    </div>
  );
}

export default ChatList;