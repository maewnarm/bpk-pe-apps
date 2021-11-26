import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface itemType {
  name: string;
  id: number;
}

interface otsmState {
  projectLists: itemType[];
  machineLists: itemType[];
  selectedProject: itemType;
  projectSelected: boolean;
  projectSelectDisabled: boolean;
  selectedMachine: itemType;
  machineSelected: boolean;
  machineSelectDisabled: boolean;
}

const initialState: otsmState = {
  projectLists: [],
  machineLists: [],
  selectedProject: { name: "choose one ...", id: 0 },
  projectSelected: false,
  projectSelectDisabled: false,
  selectedMachine: { name: "choose one ...", id: 0 },
  machineSelected: false,
  machineSelectDisabled: false,
};

export const otsmSlice = createSlice({
  name: "otsm",
  initialState,
  reducers: {
    setProjectLists: (state, action: PayloadAction<itemType[]>) => {
      state.projectLists = action.payload;
    },
    setMachineLists: (state, action: PayloadAction<itemType[]>) => {
      state.machineLists = action.payload;
    },
    setProject: (state, action: PayloadAction<itemType>) => {
      if (action.payload !== state.selectedProject) {
        state.selectedMachine = { name: "choose one ...", id: 0 };
        state.machineSelected = false;
      }
      state.selectedProject = action.payload;
      state.projectSelected = true;
    },
    setProjectDisable: (state, action: PayloadAction<boolean>) => {
      state.projectSelectDisabled = action.payload;
    },
    setMachine: (state, action: PayloadAction<itemType>) => {
      state.selectedMachine = action.payload;
      state.machineSelected = true;
    },
    setMachineDisable: (state, action: PayloadAction<boolean>) => {
      state.projectSelectDisabled = action.payload;
    },
  },
});

export const {
  setProjectLists,
  setMachineLists,
  setProject,
  setProjectDisable,
  setMachine,
  setMachineDisable,
} = otsmSlice.actions;

export const projectLists = (state: AppState) => state.otsmProject.projectLists;
export const machineLists = (state: AppState) => state.otsmProject.machineLists;
export const selectedProject = (state: AppState) =>
  state.otsmProject.selectedProject;
export const projectSelected = (state: AppState) =>
  state.otsmProject.projectSelected;
export const projectSelectDisabled = (state: AppState) =>
  state.otsmProject.projectSelectDisabled;
export const selectedMachine = (state: AppState) =>
  state.otsmProject.selectedMachine;
export const machineSelected = (state: AppState) =>
  state.otsmProject.machineSelected;
export const machineSelectDisabled = (state: AppState) =>
  state.otsmProject.projectSelectDisabled;

export default otsmSlice.reducer;
