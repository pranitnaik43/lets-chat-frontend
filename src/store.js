import * as redux from "redux";

import { authReducer } from "./reducers/authReducer";
import { socketReducer } from "./reducers/socketReducer";
// Root Reducer
const rootReducer = redux.combineReducers({
  auth: authReducer,
  socket: socketReducer
});

export const store = redux.createStore(rootReducer);