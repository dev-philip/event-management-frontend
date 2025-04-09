// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  user_level: string;
  profile_photo?: string;   // ✅ now optional
  uni_Id?: string;
  created_at: string;
}

const initialState: UserState = {
  user_id: "",
  firstName: "",
  lastName: "",
  email: "",
  user_level: "",
  profile_photo: "",
  created_at: ""
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addLoginUserToState: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    removeLoginUserFromState: () => initialState,
  },
});

export const { addLoginUserToState, removeLoginUserFromState } = userSlice.actions;
export default userSlice.reducer;
