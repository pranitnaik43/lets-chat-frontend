import { Modal } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const AddFriend = ({ showModal, setShowModal }) => {
  // auth state from redux store
  const authState = useSelector((state) => state.auth);
  // socket state from redux store
  const socket = useSelector((state) => state.socket.socket);

  const [email, setEmail] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    if (showModal === false) {
      setEmail("");
    }
    // eslint-disable-next-line
  }, [showModal]);

  const emitFriendRequest = () => {
    //notify receiver about the message. Keep trying every 3 secs if not sent
    let tryAgain = true;
    if(socket) {
      console.log("emit-friend-request")
      socket.emit("friend-request", email); 
      tryAgain = false;
    }
    if(tryAgain) setTimeout(emitFriendRequest, 3000);
  }

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  var config = {
    method: "POST",
    url: process.env.REACT_APP_SERVER_URL + '/friends/requests',
    headers: {
      'Content-Type': 'application/json',
      'access-token': authState.accessToken
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    config.data = { email: email, status: "pending" };
    axios(config).then(response => {
      if (response.data) {
        if (response.data.error) {
          // console.log(response.data.error.message);
          toast.error(response.data.error.message, { autoClose: 5000 });
        } else if (response.data.success) {
          // console.log(response.data.success.message);
          toast.success(response.data.success.message, { autoClose: 5000 });
          emitFriendRequest();
        }
      }
      setShowModal(false);
    }).catch(function (err) {
      console.log(err);
    });
  }

  return ( 
    <>
      <Modal show={showModal} tabIndex="-1" onEntered={() => inputRef.current.focus()}>
        <Modal.Header>
          <h5 className="modal-title">Add Friend</h5>
          <button type="button btn" className="close" onClick={() => { setShowModal(false) }}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="">
              <label htmlFor="email" className="form-label">Email address</label>
              <input name="email" type="email" className="form-control" ref={inputRef} onChange={handleChange} autoFocus={true}/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false) }}>Close</button>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={!email}>Send Friend Request</button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
 
export default AddFriend;