export const SET_SOCKET = "SET_SOCKET";

export const socketReducer = (state={socket: null}, action) => {
  if(action.type===SET_SOCKET && action.socket) {
    let newState = {socket: action.socket};
    console.log("authReducer", newState)
    return { ...newState };
  }
  return { socket: null }
}