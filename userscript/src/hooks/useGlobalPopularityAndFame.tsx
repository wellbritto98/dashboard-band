// src/hooks/useGlobalPopularityAndFame.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import $ from 'jquery';
import { Popularity, PopularityImpl } from '../shared/interfaces/popularity';


function useGlobalPopularityAndFame() {
    const [popularityList, setPopularityList] = useState<Popularity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId);

    useEffect(() => {
        if (!artistId) return;

        function getUrlDomain() {
            return window.location.hostname;
        }

        function fetchPopularityAndFame() {
            let iframe = $('<iframe id="iframe-global-data" style="display:none;"></iframe>');
            $('body').append(iframe);

            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Popularity/${artistId}`;
            $('#iframe-global-data').attr('src', url);

            $('#iframe-global-data').on('load', function () {
                const iframeContents = $('#iframe-global-data').contents();
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

                $('#iframe-global-data').remove();
            });
        }

        fetchPopularityAndFame();
    }, [artistId]);
    return { popularityList, isLoading };
}

export default useGlobalPopularityAndFame;
