// src/redux/actions/processQueue.ts

import $ from 'jquery';
import { removeTaskFromQueue, startProcessing, stopProcessing } from '../iframeSlice';
import { AppDispatch, RootState } from '../store';

export const processQueue = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { iframe } = getState();
  const { iframeId, taskQueue, isProcessing } = iframe;

  if (isProcessing || taskQueue.length === 0 || !iframeId) return;

  dispatch(startProcessing());
  const task = taskQueue[0];
  const iframeElement = $(`#${iframeId}`); // Renomeado para iframeElement para evitar conflito

  try {
    iframeElement.off('load').on('load', function () {
      const iframeDoc = iframeElement.contents() as JQuery<Document>;
      iframeDoc.find('style, link[rel="stylesheet"], script').remove();
      iframeDoc.find('.header, .footer').remove();
      task.resolve(iframeDoc);
      dispatch(removeTaskFromQueue());
      dispatch(stopProcessing());
      dispatch(processQueue());
    });
    iframeElement.attr('src', task.url);
  } catch (error) {
    task.reject(error);
    dispatch(removeTaskFromQueue());
    dispatch(stopProcessing());
    dispatch(processQueue());
  }
};
