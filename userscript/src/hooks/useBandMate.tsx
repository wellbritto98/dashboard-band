import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import $ from 'jquery';
import { Bandmate, BandmateImpl } from '../shared/interfaces/bandmate';
import { Instrument, InstrumentImpl } from '../shared/interfaces/instrument';

function useBandmate() {
    const [bandmates, setBandmates] = useState<Bandmate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistId = useSelector((state: RootState) => state.artist.artistId);
    let iframe: JQuery<HTMLElement>;

    useEffect(() => {
        if (!artistId) return;

        function getUrlDomain() {
            return window.location.hostname;
        }

        function getBandmates(): Bandmate[] {
            const bandmates: Bandmate[] = [];
            const members = document.querySelectorAll("#ctl00_cphLeftColumn_ctl01_divCurrentMembers .clear");

            members.forEach(member => {
                const hrefElement = member.querySelector("a[href*='/World/Popmundo.aspx/Character/']");
                const idHolder = member.querySelector(".idHolder");
                const nameElement = member.querySelector("p.float_left a");

                if (hrefElement && idHolder && nameElement && idHolder.textContent && nameElement.textContent) {
                    const id = parseInt(idHolder.textContent.trim(), 10);
                    const name = nameElement.textContent.trim();

                    if (!isNaN(id)) {
                        const bandmate = new BandmateImpl(id, name, 0, 0, 0, 0);
                        bandmates.push(bandmate);
                    }
                }
            });

            return bandmates;
        }

        function createIframe() {
            iframe = $('<iframe id="iframe-bandmate-data" style="display:none;"></iframe>');
            iframe.attr('sandbox', 'allow-same-origin'); // restrict to same-origin content only
            $('body').append(iframe);
            return iframe;
        }

        async function loadIframe(url: string): Promise<JQuery<Document>> {
            return new Promise((resolve, reject) => {
                iframe.off('load').on('load', function () {
                    const iframeDoc = iframe.contents() as JQuery<Document>;
                    
                    // Remove CSS, scripts, and other unnecessary resources
                    iframeDoc.find('style, link[rel="stylesheet"], script').remove();
        
                    // Optionally remove specific elements if they are not needed
                    iframeDoc.find('.header, .footer').remove();
        
                    resolve(iframeDoc);
                });
                iframe.attr('src', url);
            });
        }
        

        

        async function fetchBandmateSq(bandmate: Bandmate): Promise<Bandmate> {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Character/${bandmate.id}`;
            const iframeContents = await loadIframe(url);

            const sqElement = iframeContents.find('.charMainValues table.width100 tbody tr').eq(2).find('td span.sortkey');
            const sqValue = parseInt(sqElement.text().trim(), 10);
            bandmate.sq = !isNaN(sqValue) ? sqValue : 0;

            return bandmate;
        }

        async function fetchBandmateRelationship(bandmate: Bandmate): Promise<Bandmate> {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Interact/Details/${bandmate.id}`;
            const iframeContents = await loadIframe(url);

            const romanceElement = iframeContents.find('table.width100 tbody tr').eq(0).find('td').eq(1).find('span.sortkey');
            const friendshipElement = iframeContents.find('table.width100 tbody tr').eq(1).find('td').eq(1).find('span.sortkey');
            const hateElement = iframeContents.find('table.width100 tbody tr').eq(2).find('td').eq(1).find('span.sortkey');

            bandmate.romance = parseInt(romanceElement.text().trim(), 10) || 0;
            bandmate.friendship = parseInt(friendshipElement.text().trim(), 10) || 0;
            bandmate.hate = parseInt(hateElement.text().trim(), 10) || 0;

            return bandmate;
        }

        async function fetchInstrumentQuality(instrument: Instrument): Promise<Instrument> {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Character/ItemDetails/${instrument.id}`;
            const iframeContents = await loadIframe(url);

            const qualityText = iframeContents.find('tr:contains("Qualidade") td:nth-child(2) a').attr('title') ||
                iframeContents.find('tr:contains("Quality") td:nth-child(2) a').attr('title');

            if (qualityText) {
                instrument.quality = parseInt(qualityText.split('/')[0], 10);
            }

            return instrument;
        }

        async function fetchInstruments(bandmate: Bandmate): Promise<Instrument[]> {
            const urlDomain = getUrlDomain();
            const url = `https://${urlDomain}/World/Popmundo.aspx/Character/Items/${bandmate.id}`;
            const iframeContents = await loadIframe(url);

            const rows = iframeContents.find('#checkedlist tbody tr');
            const instruments: Instrument[] = [];
            let isInstrumentGroup = false;

            rows.each(function () {
                const row = $(this);

                if (row.hasClass('group') && (row.find('td').text().trim() === 'Instrumentos musicais' || row.find('td').text().trim() === 'Musical Instrument')) {
                    isInstrumentGroup = true;
                    return;
                }

                if (row.hasClass('group') && isInstrumentGroup) {
                    isInstrumentGroup = false;
                }

                if (isInstrumentGroup && !row.hasClass('group')) {
                    const name = row.find('td a').text().trim();
                    const url = row.find('td a').attr('href');
                    const idMatch = url ? url.match(/(\d+)$/) : null;
                    const id = idMatch ? parseInt(idMatch[0], 10) : null;

                    if (name && id) {
                        const instrument = new InstrumentImpl(id, name);
                        instruments.push(instrument);
                    }
                }
            });

            for (const instrument of instruments) {
                await fetchInstrumentQuality(instrument);
            }

            return instruments;
        }

        async function loadBandmatesData() {
            console.time("Data Collection Time"); // Start timer
            setIsLoading(true);
            createIframe(); // Create a persistent iframe
        
            const initialBandmates = getBandmates();
        
            for (const bandmate of initialBandmates) {
                await fetchBandmateSq(bandmate);
                bandmate.instruments = await fetchInstruments(bandmate);
                await fetchBandmateRelationship(bandmate);
            }
        
            setBandmates(initialBandmates);
            setIsLoading(false);
            console.timeEnd("Data Collection Time"); // End timer and log time
        }
        
        loadBandmatesData();
        
        return () => {
            iframe.remove();
        };
        
    }, [artistId]);

    return { bandmates, isLoading };
}

export default useBandmate;
