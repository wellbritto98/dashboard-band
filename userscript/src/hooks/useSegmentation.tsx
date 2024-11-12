import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Segmentation, SegmentationImpl } from '../shared/interfaces/segmentation';
import { addTaskToQueue } from '../redux/iframeSlice';
import $ from 'jquery';
import { processQueue } from '../redux/actions/processIframeQueue';

function useSegmentation() {
    const [segmentationList, setSegmentationList] = useState<Segmentation[]>([]);
    const [isLoadingSegmentation, setIsLoadingSegmentation] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId);
    const iframeId = useSelector((state: RootState) => state.iframe.iframeId);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (!artistId || !iframeId) return;

        function isNullOrEmpty(value: string | null | undefined): boolean {
            return !value || value.trim().length === 0;
        }

        function getUrlDomain() {
            return window.location.hostname;
        }

        async function loadIframe(url: string): Promise<JQuery<Document>> {
            return new Promise((resolve, reject) => {
                dispatch(addTaskToQueue({ url, resolve, reject }));
                dispatch(processQueue());
            });
        }

        async function fetchSegmentation() {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Popularity/${artistId}`;
            const iframeContents = await loadIframe(url);

            // Remove CSS, scripts, and other unnecessary resources
            iframeContents.find('style, link[rel="stylesheet"], script').remove();
            iframeContents.find('.header, .footer').remove();

            const rows = iframeContents.find('#tablemarketsegments tbody tr');
            const newSegmentationList: Segmentation[] = [];

            rows.each(function () {
                const marketSegmentation = $(this).find('td:nth-child(1)').text().trim();
                const value = parseInt($(this).find('td:nth-child(2) .sortkey').text(), 10);

                if (!isNullOrEmpty(marketSegmentation) && !isNaN(value)) {
                    newSegmentationList.push(new SegmentationImpl(marketSegmentation, value));
                }
            });

            setSegmentationList(newSegmentationList);
            setIsLoadingSegmentation(false);
        }

        fetchSegmentation();
    }, [artistId, iframeId, dispatch]);

    return { segmentationList, isLoadingSegmentation };
}

export default useSegmentation;
