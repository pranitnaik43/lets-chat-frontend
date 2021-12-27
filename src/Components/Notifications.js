import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const Notifications = () => {
  // auth state from redux store
  const authState = useSelector((state) => state.auth);
  // socket state from redux store
  const socket = useSelector((state) => state.socket.socket);

  const [friendRequests, setRequests] = useState([]);

  const friendRequestStatus = {
    PENDING: "pending",
    REJECTED: "rejected",
    ACCEPTED: "accepted"
  }

  var configTemp = {
    headers: {
      'access-token': authState.accessToken
    }
  };

  const getFriendRequests = () => {
    let config = { ...configTemp };
    config.url = process.env.REACT_APP_SERVER_URL + '/friends/requests';
    config.method = 'GET';
    axios(config).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
        setRequests([]);
      } else if (response.data && Array.isArray(response.data)) {
        setRequests([...response.data]);
      } else {
        setRequests([]);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    getFriendRequests();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(socket);
    if (socket) {
      console.log("event added:", authState.userEmail);
      socket.on(authState.userEmail, (message) => { 
        console.log(message);
        if (message === "friend-request") getFriendRequests();
      });
    }
    // eslint-disable-next-line
  }, [socket]);

  const acceptFriendRequest = (friendsMail) => {
    let config = { ...configTemp };
    config.url = process.env.REACT_APP_SERVER_URL + '/friends/requests';
    config.method = 'POST';
    config.data = {
      email: friendsMail,
      status: friendRequestStatus.ACCEPTED
    }
    axios(config).then((response) => {
      // console.log(config, response)
      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        let tempRequests = friendRequests.filter(friendRequest => (friendRequest.friendsData.email !== friendsMail));
        setRequests([...tempRequests]);
      } else {
        setRequests([]);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const rejectFriendRequest = (friendsMail) => {
    let config = { ...configTemp };
    config.url = process.env.REACT_APP_SERVER_URL + '/friends/requests';
    config.method = 'POST';
    config.data = {
      email: friendsMail,
      status: friendRequestStatus.REJECTED
    }
    axios(config).then((response) => {
      // console.log(config, response)
      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        let tempRequests = friendRequests.filter(friendRequest => (friendRequest.friendsData.email !== friendsMail));
        setRequests([...tempRequests]);
      } else {
        setRequests([]);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <>
      {console.log(friendRequests, socket)}
      <button className='btn btn-outline-light mx-1 my-1 my-md-0' type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        <span className='position-relative'>
          <i className="bi bi-bell-fill"></i>
          {
            (friendRequests.length > 0) ? (
              <small className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{friendRequests.length}</small>
            ) : (<></>)
          }
        </span>
      </button>
      {

        <ul className="dropdown-menu bg-dark text-white position-absolute p-1 overflow-auto" aria-labelledby="dropdownMenuButton" style={{ width: "200px", maxHeight: "300px" }}>
          {
            (friendRequests.length > 0) ? (
              friendRequests.map(request => (
                <li key={request._id} className='d-flex flex-row border border-secondary p-1'>
                  <div className='mx-1'><small>{request.friendsData.first_name + " " + request.friendsData.last_name + " sent you a friend request"}</small></div>
                  <div className='mx-1'><button className='btn btn-primary px-1 py-1 my-1' onClick={() => { acceptFriendRequest(request.friendsData.email) }}><i className="bi bi-person-plus"></i></button></div>
                  <div className='mx-1'><button className='btn btn-danger px-1 py-1 my-1' onClick={() => { rejectFriendRequest(request.friendsData.email) }}><i className='bi bi-trash'></i></button></div>
                </li>
              ))
            ) : (<li className='border border-secondary p-1 text-center'>empty</li>)
          }
        </ul>

      }
    </>
  );
}

export default Notifications;