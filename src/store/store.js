// store ko chaiye ki mujhe sare reducers k baare me btao

import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice';

const store = configureStore({
    reducer: {
         auth: authSlice
    },
});









export default store; 