// src/redux/artistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const artistSlice = createSlice({
    name: "artist",
    initialState: { artistId: null },
    reducers: {
        setArtistId: (state, action) => {
            state.artistId = action.payload;
        }
    }
});

export const { setArtistId } = artistSlice.actions;
export default artistSlice.reducer;
