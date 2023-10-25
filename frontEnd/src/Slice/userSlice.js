import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name:"userSlice",
    initialState:{
        users :[],
    },
    reducers:{
        getUsers:(state,param)=>{
            const {payload} = param;
            state.users = [...state.users,...payload.data]
        },
    }
});
export default userSlice.reducer;
export const {getUsers} = userSlice.actions;
