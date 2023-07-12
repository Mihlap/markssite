import { configureStore } from "@reduxjs/toolkit";
// импортируйте ваши редьюсеры здесь
import projectSlice from "./Slice/projectSlice";
import staffSlice from './Slice/StaffSlice';
import counterSlice from './Slice/counterSlice';
import authSlice from './Slice/authSlice';


export default configureStore({
  reducer: {
    // добавьте все ваши редьюсеры здесь
    project: projectSlice,
    staff: staffSlice,
    counter: counterSlice,
    auth: authSlice,
  },
});
