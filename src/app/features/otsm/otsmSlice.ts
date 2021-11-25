import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface otsmState {
    selectedProject: string
    projectSelected: boolean
    projectSelectDisabled: boolean
    selectedMachine: string
    machineSelected: boolean
    machineSelectDisabled: boolean
}

const initialState: otsmState = {
    selectedProject: "choose one ...",
    projectSelected: false,
    projectSelectDisabled: false,
    selectedMachine: "choose one ...",
    machineSelected: false,
    machineSelectDisabled: false
}

export const otsmSlice = createSlice({
    name: "otsm",
    initialState,
    reducers: {
        setProject: (state, action: PayloadAction<string>) => {
            if (action.payload !== state.selectedProject) {
                state.selectedMachine = "choose one ..."
                state.machineSelected = false
            }
            state.selectedProject = action.payload
            state.projectSelected = true

        },
        setProjectDisable: (state, action: PayloadAction<boolean>) => {
            state.projectSelectDisabled = action.payload
        },
        setMachine: (state, action: PayloadAction<string>) => {
            state.selectedMachine = action.payload
            state.machineSelected = true
        },
        setMachineDisable: (state, action: PayloadAction<boolean>) => {
            state.projectSelectDisabled = action.payload
        }
    }
})

export const {
    setProject,
    setProjectDisable,
    setMachine,
    setMachineDisable
} = otsmSlice.actions

export const selectedProject = (state: AppState) => state.otsmProject.selectedProject
export const projectSelected = (state: AppState) => state.otsmProject.projectSelected
export const projectSelectDisabled = (state: AppState) => state.otsmProject.projectSelectDisabled
export const selectedMachine = (state: AppState) => state.otsmProject.selectedMachine
export const machineSelected = (state: AppState) => state.otsmProject.machineSelected
export const machineSelectDisabled = (state: AppState) => state.otsmProject.projectSelectDisabled

export default otsmSlice.reducer