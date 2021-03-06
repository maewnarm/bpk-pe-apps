import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import otsmReducer from './features/otsm/otsmSlice'
import loaderReducer from './features/loader/loaderSlice'
import isvReducer from './features/isv/isvSlice'

export function makeStore() {
    return configureStore({
        reducer: {
            otsm: otsmReducer,
            loader: loaderReducer,
            isv: isvReducer,
        },
    })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>

export default store