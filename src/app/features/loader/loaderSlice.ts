import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoaderState {
  isActive: boolean;
}

const initialState: LoaderState = {
  isActive: false
}

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoaderIsActive: (state,action:PayloadAction<boolean>) => {
      state.isActive = action.payload
    }
  }
})

export const {setLoaderIsActive} = loaderSlice.actions

export const loaderIsActive = (state: AppState) => state.loader.isActive

export default loaderSlice.reducer