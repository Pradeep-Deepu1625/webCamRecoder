import ReactDom from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./Slice/userSlice";
const Store = configureStore({
  reducer : rootReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:["/userSlice/getUsers"],
      // ignoreActions:["/userSlice/postUsers"]
    }
  })
})
const Root = ReactDom.createRoot(document.getElementById("root"));
Root.render(
  <Provider store={Store}>
    <App></App>
  </Provider>
)