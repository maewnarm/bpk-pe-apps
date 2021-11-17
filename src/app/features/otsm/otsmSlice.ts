import { AppState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface otsmState {
    selectedProject: string
    projectSelected: boolean
    selectedMachine: string
    machineSelected: boolean
}

const initialState: otsmState = {
    selectedProject: "choose one ...",
    projectSelected: false,
    selectedMachine: "choose one ...",
    machineSelected: false
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
        setMachine: (state, action: PayloadAction<string>) => {
            state.selectedMachine = action.payload
            state.machineSelected = true
        }
    }
})

export const {
    setProject,
    setMachine
} = otsmSlice.actions

export const selectedProject = (state: AppState) => state.otsmProject.selectedProject
export const projectSelected = (state: AppState) => state.otsmProject.projectSelected
export const selectedMachine = (state: AppState) => state.otsmProject.selectedMachine
export const machineSelected = (state: AppState) => state.otsmProject.machineSelected

export default otsmSlice.reducer