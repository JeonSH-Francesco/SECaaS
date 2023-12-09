import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/appSateSlice";

export const store = configureStore({
    reducer: {
        appState: appStateSlice
    }
})

export type RootState = ReturnType<typeof store.getState>

