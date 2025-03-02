import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Single, SingleImpl } from '../shared/interfaces/single';
import { addTaskToQueue } from '../redux/iframeSlice';
import { processQueue } from '../redux/actions/processIframeQueue';
import $ from 'jquery';

function useSingles() {
    const [singles, setSingles] = useState<Single[]>([]);
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

        async function fetchSingles() {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Records/${artistId}`;
            const iframeContents = await loadIframe(url);

            iframeContents.find('style, link[rel="stylesheet"], script').remove();
            iframeContents.find('.header, .footer').remove();

            const singleElements = iframeContents.find('#tablesingles tbody tr').slice(0, 4);

            const singleUrls = singleElements
                .map(function () {
                    const singleHref = $(this).find('a').attr('href');
                    return singleHref ? `https://${urlDomain}${singleHref}` : null;
                })
                .get()
                .filter(Boolean) as string[];

            const singlesData: Single[] = [];
            for (const singleUrl of singleUrls) {
                const single = await fetchSingleDetails(singleUrl);
                if (single) singlesData.push(single);
            }

            setSingles(singlesData);
            setIsLoading(false);
        }

        async function fetchSingleDetails(url: string): Promise<Single | null> {
            try {
                const iframeContents = await loadIframe(url);

                const recordCover = iframeContents.find('.RecordCover').length
                    ? iframeContents.find('.RecordCover')
                    : iframeContents.find('.RecordCoverEmpty');

                const title = recordCover.next('table').find('tbody tr').eq(0).find('td').eq(1).text().trim();

                const releaseDateStr = iframeContents.find('.RecordCover + table tbody tr').eq(2).find('td').eq(1).text().trim();
                const releaseDate = new Date(releaseDateStr);

                const sellsStr = iframeContents.find("a#ctl00_cphLeftColumn_ctl01_lnkUnitsSold").text().replace(/\D/g, '');
                const sells = parseInt(sellsStr, 10) || 0;

                const stockStr = iframeContents.find('.RecordCover + table tbody tr').eq(7).find('td').eq(1).text().replace(/\D/g, '');
                const stock = parseInt(stockStr, 10) || 0;

                const lastSellRow = iframeContents.find('#tablerecentsales tbody tr').first();
                const lastSellDateStr = lastSellRow.find('td').eq(0).clone().children().remove().end().text().trim();
                const [day, month, year] = lastSellDateStr.split('/').map(Number);
                const lastSellDate = new Date(year, month - 1, day);

                const lastSellStr = lastSellRow.find('td').eq(1).text().replace(/\D/g, '');
                const lastSell = parseInt(lastSellStr, 10) || 0;

                const artistGainStr = iframeContents.find('.RecordCover + table tbody tr').eq(10).find('td').last().text().replace(/[^0-9,]/g, '').replace(',', '.');
                const artistGain = parseFloat(artistGainStr) || 0;

                const recordLabelGainStr = iframeContents.find('.RecordCover + table tbody tr').eq(11).find('td').last().text().replace(/[^0-9,]/g, '').replace(',', '.');
                const recordLabelGain = parseFloat(recordLabelGainStr) || 0;

                const evaluationStr = iframeContents.find('tr').eq(8).find('a').attr('title') || '0/26';
                const evaluation = parseInt(evaluationStr.split('/')[0]) || 0;

                const imageUrl = iframeContents.find('.RecordCover').css('background-image')?.slice(5, -2) || '';

                return new SingleImpl(
                    title,
                    sells,
                    lastSell,
                    lastSellDate,
                    artistGain,
                    recordLabelGain,
                    evaluation,
                    imageUrl,
                    releaseDate,
                    stock
                );
            } catch (error) {
                console.error('Error fetching single details:', error);
                return null;
            }
        }

        fetchSingles();
    }, [artistId, iframeId, dispatch]);

    return { singles, isLoading };
}

export default useSingles;
