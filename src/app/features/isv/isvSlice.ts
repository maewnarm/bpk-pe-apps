import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { extraDataTypes } from "@/components/isv/types";

interface objectKeyString {
  [key: string]: object;
}

interface isvState {
  selectedMachines: objectKeyString;
  chartExtraData: extraDataTypes;
  visibleExtraData: boolean;
}

const initialState = {
  selectedMachines: {},
  chartExtraData: {
    type: "",
    start_time: "",
    end_time: "",
    diffTime: {},
    diffTimeSecond: 0,
    detail: "",
    result: "",
    p_sigval: "",
    c_sigval: "",
    x: 0,
    y: 0,
  },
  visibleExtraData: false,
};

export const isvSlice = createSlice({
  name: "isv",
  initialState,
  reducers: {
    setSelectedMachines: (state, action: PayloadAction<objectKeyString>) => {
      state.selectedMachines = action.payload;
    },
    setChartExtraData: (state, action: PayloadAction<any>) => {
      state.chartExtraData = action.payload;
    },
    setVisibleExtraData: (state, action: PayloadAction<boolean>) => {
      state.visibleExtraData = action.payload;
    },
  },
});

export const {
  setSelectedMachines,
  setChartExtraData,
  setVisibleExtraData,
} = isvSlice.actions;

export const selectedMachines = (state: AppState) => state.isv.selectedMachines;
export const chartExtraData = (state: AppState) => state.isv.chartExtraData;
export const visibleExtraData = (state: AppState) => state.isv.visibleExtraData;

export default isvSlice.reducer;
