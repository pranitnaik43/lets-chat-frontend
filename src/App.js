import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";

import { store } from "./store";
import './App.css';
import Nav from './Components/Nav';
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Home from "./Components/Home";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Provider store={store}>
          <h1 className="logo m-2">LetsChat</h1>
          <Nav />
          <div className="container-fluid">
            <Switch>
              <Route exact path="/home" component={Home}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/" exact>
                <Redirect to="/home" />
              </Route>
            </Switch>
          </div>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
