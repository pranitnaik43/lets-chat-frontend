import { NavLink, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { EMPTY } from "../reducers/authReducer";
import { useEffect } from 'react';

const Nav = ({ history }) => {

  // auth state from redux store
  const authState = useSelector((state) => state.auth);
  // console.log(authState);

  // dispatch actions for auth reducer
  const dispatch = useDispatch();
  const resetAuth = () => dispatch({ type: EMPTY });

  useEffect(() => {
    if (!authState.accessToken) {
      history.push("/login");
    }
    // eslint-disable-next-line
  }, []);

  const handleLogout = (e) => {
    resetAuth();
    history.push("/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-50 border border-light">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mx-3" id="navbarNav">
          <ul className="navbar-nav">
            {
              (authState.accessToken) ? (
                <>
                  <NavLink className="nav-link" to="/home">Home</NavLink>
                  <button className="btn btn-outline-light mx-1"><i className="bi bi-person-plus me-2"></i>Add Friend</button>
                  <button className="btn btn-outline-light mx-1"><i className="bi bi-people me-2"></i>Create Group</button>
                </>
              ) : (<></>)
            }
            {
              (authState.isAdmin) ? (
                <>
                  <NavLink className="nav-link" to="/add-friend">Add Friend</NavLink>
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