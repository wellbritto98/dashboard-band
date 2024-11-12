import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Show, ShowImpl } from '../shared/interfaces/shows';
import { addTaskToQueue } from '../redux/iframeSlice';
import { processQueue } from '../redux/actions/processIframeQueue';
import $ from 'jquery';

function useShow() {
    const [showsList, setShowsList] = useState<Show[]>([]);
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
                dispatch(processQueue()); // Agora é tratado como uma ação com `AppDispatch`
            });
        }

        async function fetchShows() {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/UpcomingPerformances/${artistId}`;
            const iframeContents = await loadIframe(url);

            const rows = iframeContents.find('#tableupcoming tbody tr');
            const newShowsList: Show[] = [];

            rows.each(function () {
                const dateText = $(this).find('td:nth-child(1)').contents().filter(function () {
                    return this.nodeType === Node.TEXT_NODE;
                }).text().trim();
                console.log('dateText', dateText);
                const dateParts = dateText.split(', ')[0].split('/');
                const timePart = dateText.split(', ')[1];
                const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timePart}`);


                const city = $(this).find('td:nth-child(2) a').last().text().trim();
                const sales = parseInt($(this).find('td:nth-child(3)').text().trim(), 10);

                const idMatch = $(this).find('a').last().attr('href')?.match(/\/(\d+)$/);
                const id = idMatch ? parseInt(idMatch[1], 10) : 0;

                if (id && !isNaN(sales)) {
                    newShowsList.push(new ShowImpl(id, date, city, sales));
                }
            });

            setShowsList(newShowsList);
            setIsLoading(false);
        }

        fetchShows();
    }, [artistId, iframeId, dispatch]);
    console.log('showsList', showsList);
    return { showsList, isLoading };
}

export default useShow;
