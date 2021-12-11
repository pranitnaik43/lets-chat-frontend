export const SET_ID = "SET_ID";

export const groupReducer = (state={groupId: null}, action) => {
  if(action.type===SET_ID && action.groupId) {
    return { groupId: action.groupId }
  }
  return { groupId: null }
}