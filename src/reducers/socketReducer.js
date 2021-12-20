export const SET_SOCKET = "SET_SOCKET";

export const socketReducer = (state={socket: null}, action) => {
  if(action.type===SET_SOCKET && action.socket) {
    // console.log(action.socket);
    return { socket: action.socket };
  }
  return { socket: null }
}