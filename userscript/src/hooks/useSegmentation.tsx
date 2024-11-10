// src/hooks/useGlobalFame.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Importa o tipo RootState
import $ from 'jquery';
import { Segmentation, SegmentationImpl } from '../shared/interfaces/segmentation';

function useSegmentation() {
    const [segmentationList, setSegmentationList] = useState<Segmentation[]>([]);
    const [isLoadingSegmentation, setIsLoadingSegmentation] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId); // Define o tipo RootState

    useEffect(() => {
        if (!artistId) return;
        function isNullOrEmpty(value: string | null | undefined): boolean {
            return !value || value.trim().length === 0;
        }
        function getUrlDomain() {
            return window.location.hostname;
        }

        function fetchSegmentation() {
            let iframe = $('<iframe id="iframe-segmentation" style="display:none;"></iframe>');
            iframe.attr('sandbox', 'allow-same-origin'); // restrict to same-origin content only
            $('body').append(iframe);

            let urlDomain = getUrlDomain();
            let url = `https://${urlDomain}/World/Popmundo.aspx/Artist/Popularity/${artistId}`;
            $('#iframe-segmentation').attr('src', url);

            $('#iframe-segmentation').on('load', function () {
                let iframeContents = $('#iframe-segmentation').contents();
                 // Remove CSS, scripts, and other unnecessary resources
                 iframeContents.find('style, link[rel="stylesheet"], script').remove();

                 // Optionally remove specific elements if they are not needed
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

                $('#iframe-segmentation').remove();
            });
        }

        fetchSegmentation();
    }, [artistId]);
    return { segmentationList, isLoadingSegmentation };
}

export default useSegmentation;
