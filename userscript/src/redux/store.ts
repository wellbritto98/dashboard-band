// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import artistReducer from "./artistSlice"; // Supondo que você tenha um slice para o artista
import iframeReducer from "./iframeSlice"; // Certifique-se de que o caminho está correto

export const store = configureStore({
    reducer: {
        artist: artistReducer, // Inclua o slice do artista
        iframe: iframeReducer, // Inclua o slice do iframe
    },
});

// Defina os tipos para o estado e o dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
