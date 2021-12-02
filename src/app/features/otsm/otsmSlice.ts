import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface itemType {
  id: number;
  name: string;
  product?: string;
  part?: string;
}

interface otsmState {
  projectLists: itemType[];
  selectedProject: itemType;
  projectSelected: boolean;
  projectSelectDisabled: boolean;
  resetProjectSelection: boolean;

  machineLists: itemType[];
  selectedMachine: itemType;
  machineSelected: boolean;
  machineSelectDisabled: boolean;
}

const initialState: otsmState = {
  projectLists: [],
  selectedProject: { id: 0, name: "choose one ...", product: "", part: "" },
  projectSelected: false,
  projectSelectDisabled: false,
  resetProjectSelection: false,

  machineLists: [],
  selectedMachine: { name: "choose one ...", id: 0 },
  machineSelected: false,
  machineSelectDisabled: false,
};

export const otsmSlice = createSlice({
  name: "otsm",
  initialState,
  reducers: {
    //project
    setProjectLists: (state, action: PayloadAction<itemType[]>) => {
      state.projectLists = action.payload;
    },
    setProject: (state, action: PayloadAction<itemType>) => {
      if (action.payload !== state.selectedProject) {
        state.selectedMachine = { name: "choose one ...", id: 0 };
        state.machineSelected = false;
      }
      state.selectedProject = action.payload;
      state.projectSelected = true;
    },
    setProjectSelected: (state, action: PayloadAction<boolean>) => {
      state.projectSelected = action.payload;
    },
    setProjectDisable: (state, action: PayloadAction<boolean>) => {
      state.projectSelectDisabled = action.payload;
    },
    setResetProjectSelection: (state, action: PayloadAction<boolean>) => {
      state.resetProjectSelection = action.payload;
    },

    //machine
    setMachineLists: (state, action: PayloadAction<itemType[]>) => {
      state.machineLists = action.payload;
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
  setProject,
  setProjectSelected,
  setProjectDisable,
  setResetProjectSelection,

  setMachineLists,
  setMachine,
  setMachineDisable,
} = otsmSlice.actions;

export const projectLists = (state: AppState) => state.otsmProject.projectLists;
export const selectedProject = (state: AppState) =>
  state.otsmProject.selectedProject;
export const projectSelected = (state: AppState) =>
  state.otsmProject.projectSelected;
export const projectSelectDisabled = (state: AppState) =>
  state.otsmProject.projectSelectDisabled;
export const projectResetSelection = (state: AppState) =>
  state.otsmProject.resetProjectSelection;

export const machineLists = (state: AppState) => state.otsmProject.machineLists;
export const selectedMachine = (state: AppState) =>
  state.otsmProject.selectedMachine;
export const machineSelected = (state: AppState) =>
  state.otsmProject.machineSelected;
export const machineSelectDisabled = (state: AppState) =>
  state.otsmProject.projectSelectDisabled;

export default otsmSlice.reducer;
