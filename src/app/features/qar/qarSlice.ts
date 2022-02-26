import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface qarState {

}

const initialState: qarState = {

}

export const qarSlice = createSlice({
  name: "qar",
  initialState,
  reducers: {

  }
})

export const {} = qarSlice.actions

// export const ... = (state: AppState) => state.qar.___

export default qarSlice.reducer