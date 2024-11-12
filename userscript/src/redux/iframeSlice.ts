// src/redux/slices/iframeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IframeTask {
  url: string;
  resolve: (value: JQuery<Document>) => void;
  reject: (reason?: any) => void;
}

interface IframeState {
  iframeId: string | null;
  taskQueue: IframeTask[];
  isProcessing: boolean;
}

const initialState: IframeState = {
  iframeId: null,
  taskQueue: [],
  isProcessing: false,
};

const iframeSlice = createSlice({
  name: 'iframe',
  initialState,
  reducers: {
    setIframeId: (state, action: PayloadAction<string>) => {
      state.iframeId = action.payload;
    },
    removeIframeId: (state) => {
      state.iframeId = null;
    },
    addTaskToQueue: (state, action: PayloadAction<IframeTask>) => {
      state.taskQueue.push(action.payload);
    },
    startProcessing: (state) => {
      state.isProcessing = true;
    },
    stopProcessing: (state) => {
      state.isProcessing = false;
    },
    removeTaskFromQueue: (state) => {
      state.taskQueue.shift();
    },
  },
});

export const { setIframeId, removeIframeId, addTaskToQueue, startProcessing, stopProcessing, removeTaskFromQueue } = iframeSlice.actions;

export default iframeSlice.reducer;
