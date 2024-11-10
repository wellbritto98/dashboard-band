// src/hooks/useSingles.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import $ from 'jquery';
import { Single, SingleImpl } from '../shared/interfaces/single'; // Importa a interface e a classe




function useSingles() {
    const [singles, setSingles] = useState<Single[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId);

    useEffect(() => {
        if (!artistId) return;

        function getUrlDomain() {
            return window.location.hostname;
        }

        function fetchSingles() {
            const iframeSingles = $('<iframe id="iframe-singles" style="display:none;"></iframe>');
            iframeSingles.attr('sandbox', 'allow-same-origin'); // restrict to same-origin content only
            $('body').append(iframeSingles);

            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Records/${artistId}`;
            $('#iframe-singles').attr('src', url);

            $('#iframe-singles').on('load', function () {
                const iframeContents = $('#iframe-singles').contents();
                // Remove CSS, scripts, and other unnecessary resources
                iframeContents.find('style, link[rel="stylesheet"], script').remove();
                // Optionally remove specific elements if they are not needed
                iframeContents.find('.header, .footer').remove();
                const singleElements = iframeContents.find('#tablesingles tbody tr').slice(0, 4); // Seleciona os últimos 4 singles

                const singleHrefs = singleElements.map(function () {
                    const singleHref = $(this).find('a').attr('href');
                    return singleHref ? `https://${urlDomain}${singleHref}` : null;
                }).get().filter(Boolean); // Array com URLs de singles, ignorando valores nulos

                let singlesData: Single[] = [];

                // Função para buscar detalhes de cada single sequencialmente
                function fetchSingleSequentially(index = 0) {
                    if (index >= singleHrefs.length) {
                        // Atualiza o estado com todos os singles obtidos
                        setSingles(singlesData);
                        setIsLoading(false);
                        $('#iframe-singles').remove();
                        return;
                    }

                    const singleUrl = singleHrefs[index];
                    fetchSingleDetails(singleUrl).then((single) => {
                        if (single) singlesData.push(single);
                        fetchSingleSequentially(index + 1); // Chama a função recursivamente para o próximo single
                    });
                }

                // Inicia a sequência de busca
                fetchSingleSequentially();
            });
        }

        function fetchSingleDetails(url: string): Promise<Single | null> {
            return new Promise((resolve) => {
                try {
                    const iframeSingle = $('<iframe id="iframe-single" style="display:none;"></iframe>');
                    $('body').append(iframeSingle);
                    $('#iframe-single').attr('src', url);

                    $('#iframe-single').on('load', function () {
                        const singleContents = $('#iframe-single').contents();

                        const recordCover = singleContents.find('.RecordCover').length
                            ? singleContents.find('.RecordCover')
                            : singleContents.find('.RecordCoverEmpty');

                        const title = recordCover.next('table').find('tbody tr').eq(0).find('td').eq(1).text().trim();

                        const releaseDateStr = singleContents.find('.RecordCover + table tbody tr').eq(2).find('td').eq(1).text().trim();
                        const releaseDate = new Date(releaseDateStr);

                        const sellsStr = singleContents.find("a#ctl00_cphLeftColumn_ctl01_lnkUnitsSold").text().replace(/\D/g, '');
                        const sells = parseInt(sellsStr, 10) || 0;

                        // Fetch the stock value based on row index
                        const stockStr = singleContents.find('.RecordCover + table tbody tr').eq(7).find('td').eq(1).text().replace(/\D/g, '');
                        const stock = parseInt(stockStr, 10) || 0;

                        const lastSellRow = singleContents.find('#tablerecentsales tbody tr').first();
                        const lastSellDateStr = lastSellRow.find('td').eq(0).clone().children().remove().end().text().trim();

                        const [day, month, year] = lastSellDateStr.split('/').map(Number);
                        const lastSellDate = new Date(year, month - 1, day);

                        const lastSellStr = lastSellRow.find('td').eq(1).text().replace(/\D/g, '');
                        const lastSell = parseInt(lastSellStr, 10) || 0;

                        const artistGainStr = singleContents.find('.RecordCover + table tbody tr').eq(10).find('td').last().text().replace(/[^0-9,]/g, '').replace(',', '.');
                        const artistGain = parseFloat(artistGainStr) || 0;

                        const recordLabelGainStr = singleContents.find('.RecordCover + table tbody tr').eq(11).find('td').last().text().replace(/[^0-9,]/g, '').replace(',', '.');
                        const recordLabelGain = parseFloat(recordLabelGainStr) || 0;

                        const evaluationStr = singleContents.find('tr').eq(8).find('a').attr('title') || '0/26';
                        const evaluation = parseInt(evaluationStr.split('/')[0]) || 0;

                        const imageUrl = singleContents.find('.RecordCover').css('background-image')?.slice(5, -2) || '';

                        const single = new SingleImpl(
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

                        resolve(single);
                        $('#iframe-single').remove();
                    });

                } catch (error) {
                    console.error('Error fetching single details:', error);
                    resolve(null);
                }
            });
        }


        fetchSingles();
    }, [artistId]);
    console.log(singles);
    return { singles, isLoading };
}

export default useSingles;
