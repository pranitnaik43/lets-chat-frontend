import Cookies from 'js-cookie'

export const SET = "SET";
export const EMPTY = "EMPTY";

let accessToken = Cookies.get("accessToken"); 
if(!accessToken) accessToken = null;

let isAdmin = Cookies.get("isAdmin");
if(!isAdmin) isAdmin = false;

let userEmail = Cookies.get("userEmail");
if(!userEmail) userEmail = null;

export const authReducer = (
  state={
    accessToken: accessToken, 
    isAdmin: isAdmin, 
    userEmail:userEmail
  }, action) => {
  switch(action.type) {
    case SET: {
      if(action.data) {
        if(action.data.accessToken) {
          let accessToken = action.data.accessToken;
          state.accessToken = accessToken
          //set cookie (expires in 2 days)
          Cookies.set('accessToken', accessToken, { expires: 2 })
        }
        if(action.data.isAdmin===true) {
          let isAdmin = action.data.isAdmin;
          state.isAdmin = true;
          //set cookie (expires in 2 days)
          Cookies.set('isAdmin', isAdmin, { expires: 2 })
        }
        if(action.data.userEmail) {
          let userEmail = action.data.userEmail;
          state.userEmail = userEmail;
          //set cookie (expires in 2 days)
          Cookies.set('userEmail', userEmail, { expires: 2 })
        }
      }
      return { ...state };
    }

    case EMPTY: {
      Cookies.remove('accessToken');
      Cookies.remove('isAdmin');
      Cookies.remove('userEmail');
      return {accessToken: null, isAdmin: false, userEmail:null};
    }

    default: {
      return state;
    }
      
  }
}