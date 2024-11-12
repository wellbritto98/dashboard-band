import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Album, AlbumImpl } from '../shared/interfaces/album.ts';
import { addTaskToQueue } from '../redux/iframeSlice';
import { processQueue } from '../redux/actions/processIframeQueue';
import $ from 'jquery';

function useAlbums() {
    const [albums, setAlbums] = useState<Album[]>([]);
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

        async function fetchAlbums() {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Records/${artistId}`;
            const iframeContents = await loadIframe(url);

            iframeContents.find('style, link[rel="stylesheet"], script').remove();
            iframeContents.find('.header, .footer').remove();

            const albumElements = iframeContents.find('#tablealbums tbody tr').slice(0, 4);

            const albumUrls = albumElements
                .map(function () {
                    const albumHref = $(this).find('a').attr('href');
                    return albumHref ? `https://${urlDomain}${albumHref}` : null;
                })
                .get()
                .filter(Boolean) as string[];

            const albumsData: Album[] = [];
            for (const albumUrl of albumUrls) {
                const album = await fetchAlbumDetails(albumUrl);
                if (album) albumsData.push(album);
            }

            setAlbums(albumsData);
            setIsLoading(false);
        }

        async function fetchAlbumDetails(url: string): Promise<Album | null> {
            try {
                const iframeContents = await loadIframe(url);

                const recordCover = iframeContents.find('.RecordCover').length
                    ? iframeContents.find('.RecordCover')
                    : iframeContents.find('.RecordCoverEmpty');

                // Título
                const title = recordCover.next('table').find('tbody tr').filter((_, el) =>
                    $(el).find('td').first().text().includes('Disco:')
                ).find('td').last().text().trim();

                // Data de lançamento
                const releaseDateStr = recordCover.next('table').find('tbody tr').filter((_, el) =>
                    $(el).find('td').first().text().includes('Lançamento:')
                ).find('td').last().text().trim();
                const releaseDate = new Date(releaseDateStr);

                // Vendas
                const sellsStr = iframeContents.find("a#ctl00_cphLeftColumn_ctl01_lnkUnitsSold").text().replace(/\D/g, '');
                const sells = parseInt(sellsStr, 10) || 0;

                // Estoque
                const stockStr = recordCover.next('table').find('tbody tr').filter((_, el) =>
                    $(el).find('td').first().text().includes('Estoque:')
                ).find('td').last().text().replace(/\D/g, '');
                const stock = parseInt(stockStr, 10) || 0;

                // Última venda
                const lastSellRow = iframeContents.find('#tablerecentsales tbody tr').first();
                const lastSellDateStr = lastSellRow.find('td').eq(0).clone().children().remove().end().text().trim();
                const [day, month, year] = lastSellDateStr.split('/').map(Number);
                const lastSellDate = new Date(year, month - 1, day);

                const lastSellStr = lastSellRow.find('td').eq(1).text().replace(/\D/g, '');
                const lastSell = parseInt(lastSellStr, 10) || 0;

                // Ganhos do artista
                const artistGainStr = recordCover.next('table').find('tbody tr').filter((_, el) =>
                    $(el).find('td').first().text().includes('Ganhos do artista:')
                ).find('td').last().text().replace(/[^0-9,]/g, '').replace(',', '.');
                const artistGain = parseFloat(artistGainStr) || 0;

                // Ganhos da gravadora
                const recordLabelGainStr = recordCover.next('table').find('tbody tr').filter((_, el) =>
                    $(el).find('td').first().text().includes('Ganhos do estúdio:')
                ).find('td').last().text().replace(/[^0-9,]/g, '').replace(',', '.');
                const recordLabelGain = parseFloat(recordLabelGainStr) || 0;

                // Avaliação
                const evaluationStr = iframeContents.find('tr').filter((_, el) =>
                    $(el).find('td').first().text().includes('Resenha:')
                ).find('a').attr('title') || '0/26';
                const evaluation = parseInt(evaluationStr.split('/')[0]) || 0;

                // Imagem de capa
                const imageUrl = iframeContents.find('.RecordCover').css('background-image')?.slice(5, -2) || '';

                return new AlbumImpl(
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
                console.error('Error fetching album details:', error);
                return null;
            }
        }


        fetchAlbums();
    }, [artistId, iframeId, dispatch]);

    return { albums, isLoading };
}

export default useAlbums;
