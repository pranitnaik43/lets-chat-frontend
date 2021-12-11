import * as redux from "redux";

import { authReducer } from "./reducers/authReducer";
// Root Reducer
const rootReducer = redux.combineReducers({
  auth: authReducer,
});

export const store = redux.createStore(rootReducer);