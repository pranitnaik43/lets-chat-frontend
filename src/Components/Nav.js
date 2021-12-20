import { NavLink, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { EMPTY } from "../reducers/authReducer";
import { SET_SOCKET } from '../reducers/socketReducer';
import { useState, useEffect } from 'react';
import AddFriend from './AddFriend';
import Notifications from "./Notifications";
import socketClient from "socket.io-client";

const Nav = ({ history }) => {

  // auth state from redux store
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  // dispatch action for auth reducer
  const resetAuth = () => dispatch({ type: EMPTY });
  // dispatch action for socket reducer
  const setSocket = (socket) => dispatch({ type: SET_SOCKET, socket });

  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    if (!authState.accessToken) {
      history.push("/login");
    }

    //create socket
    var socket = socketClient(process.env.REACT_APP_SERVER_URL);
    socket.on('connection', () => {
      console.log("new connection");
    });
    //add socket to redux store
    setSocket(socket);
    // eslint-disable-next-line
  }, []);

  const handleLogout = (e) => {
    resetAuth();
    history.push("/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 border border-light w-100 position-absolute">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mx-3" id="navbarNav">
          <ul className="navbar-nav">
            {
              (authState.accessToken) ? (
                <>
                  <NavLink className="nav-link" to="/home">Home</NavLink>
                  
                  <button className="btn btn-outline-light mx-1 my-1 my-md-0" onClick={() => { setShowAddFriend(true) }}><i className="bi bi-person-plus me-2"></i>Add Friend</button>
                  <AddFriend showModal={showAddFriend} setShowModal={setShowAddFriend}/>
                  
                  <button className="btn btn-outline-light mx-1 my-1 my-md-0"><i className="bi bi-people me-2"></i>Create Group</button>
                  
                  <div className="dropdown" style={{ marginRight: "150px" }}>
                    <Notifications />
                  </div>
                </>
              ) : (<></>)
            }
            
          </ul>
          <ul className="navbar-nav ms-auto">
            {
              (authState.accessToken) ? (
                <>
                  <li className="nav-link" onClick={(e) => { handleLogout(e) }}>Logout</li>
                </>
              ) : (
                <>
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                  <NavLink className="nav-link" to="/signup">Register</NavLink>
                </>
              )
            }
          </ul>
        </div>
      </nav>
    </>
  );
}

export default withRouter(Nav);