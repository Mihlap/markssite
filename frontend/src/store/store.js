import { configureStore } from "@reduxjs/toolkit";
// импортируйте ваши редьюсеры здесь
import projectSlice from "./Slice/projectSlice";
import loginSlice from "./Slice/loginSlice";
import staffSlice from './Slice/StaffSlice';
import counterSlice from './Slice/counterSlice';


export default configureStore({
  reducer: {
    // добавьте все ваши редьюсеры здесь
    project: projectSlice,
    login: loginSlice,
    staff: staffSlice,
    counter: counterSlice,
  },
});
