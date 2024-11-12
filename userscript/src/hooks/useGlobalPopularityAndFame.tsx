import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Popularity, PopularityImpl } from '../shared/interfaces/popularity';
import { addTaskToQueue } from '../redux/iframeSlice';
import { processQueue } from '../redux/actions/processIframeQueue';
import $ from 'jquery';

function useGlobalPopularityAndFame() {
    const [popularityList, setPopularityList] = useState<Popularity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId);
    const iframeId = useSelector((state: RootState) => state.iframe.iframeId);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (!artistId || !iframeId) return;

        function getUrlDomain() {
            return window.location.hostname;
        }

        async function loadIframe(url: string): Promise<JQuery<Document>> {
            return new Promise((resolve, reject) => {
                dispatch(addTaskToQueue({ url, resolve, reject }));
                dispatch(processQueue());
            });
        }

        async function fetchPopularityAndFame() {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Popularity/${artistId}`;
            const iframeContents = await loadIframe(url);

            // Remove CSS, scripts, and other unnecessary resources
            iframeContents.find('style, link[rel="stylesheet"], script').remove();
            iframeContents.find('.header, .footer').remove();

            const rows = iframeContents.find('#tablefame tbody tr');
            const newPopularityList: Popularity[] = [];

            rows.each(function () {
                const city = $(this).find('td:nth-child(1) a').text().trim();
                const popularity = parseInt($(this).find('td:nth-child(2) .sortkey').text(), 10) - 1;
                const fame = parseInt($(this).find('td:nth-child(3) .sortkey').text(), 10);

                if (!isNaN(popularity) && !isNaN(fame)) {
                    newPopularityList.push(new PopularityImpl(city, popularity, fame));
                }
            });

            setPopularityList(newPopularityList);
            setIsLoading(false);
        }

        fetchPopularityAndFame();
    }, [artistId, iframeId, dispatch]);

    return { popularityList, isLoading };
}

export default useGlobalPopularityAndFame;
