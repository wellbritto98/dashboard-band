// src/hooks/useShow.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import $ from 'jquery';
import { Show, ShowImpl } from '../shared/interfaces/shows';

function useShow() {
    const [showsList, setShowsList] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId);

    useEffect(() => {
        if (!artistId) return;

        function getUrlDomain() {
            return window.location.hostname;
        }

        function fetchShows() {
            let iframe = $('<iframe id="iframe-shows" style="display:none;"></iframe>');
            iframe.attr('sandbox', 'allow-same-origin');
            $('body').append(iframe);

            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/UpcomingPerformances/${artistId}`;
            $('#iframe-shows').attr('src', url);

            $('#iframe-shows').on('load', function () {
                const iframeContents = $('#iframe-shows').contents();
                const rows = iframeContents.find('#tableupcoming tbody tr');

                const newShowsList: Show[] = [];
                rows.each(function () {
                    const dateText = $(this).find('td:nth-child(1)').text().trim();
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
                $('#iframe-shows').remove();
            });
        }

        fetchShows();
    }, [artistId]);
    console.log(showsList);
    return { showsList, isLoading };
}

export default useShow;
