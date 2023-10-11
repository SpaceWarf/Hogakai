import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import profileReducer from "./reducers/profile";
import divisions from "./reducers/divisions";
import roles from "./reducers/roles";
import driverStrats from "./reducers/driverStrats";
import neighbourhoods from "./reducers/neighbourhoods";
import warInfo from "./reducers/warInfo";

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'RESET') {
    state = {};
  }

  return combineReducers({
    profile: profileReducer,
    divisions: divisions,
    roles: roles,
    driverStrats: driverStrats,
    neighbourhoods: neighbourhoods,
    warInfo: warInfo,
  })(state, action);
}

const store = configureStore({
  reducer: rootReducer
});


export default store;

export type RootState = ReturnType<typeof rootReducer>;