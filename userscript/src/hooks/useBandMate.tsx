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

        async function fetchBandmateSq(bandmate: Bandmate): Promise<Bandmate> {
            return new Promise((resolve, reject) => {
                const iframe = $('<iframe id="iframe-bandmate-sq" style="display:none;"></iframe>');
                $('body').append(iframe);

                const urlDomain = getUrlDomain();
                const url = `https://${urlDomain}/World/Popmundo.aspx/Character/${bandmate.id}`;
                $('#iframe-bandmate-sq').attr('src', url);

                $('#iframe-bandmate-sq').on('load', function () {
                    const iframeContents = $('#iframe-bandmate-sq').contents();
                    const sqElement = iframeContents.find('.charMainValues table.width100 tbody tr').eq(2).find('td span.sortkey');

                    if (sqElement.length > 0) {
                        const sqValue = parseInt(sqElement.text().trim(), 10);
                        bandmate.sq = !isNaN(sqValue) ? sqValue : 0;
                        resolve(bandmate);
                    } else {
                        reject(new Error("Elemento de Star Quality (SQ) não encontrado."));
                    }

                    $('#iframe-bandmate-sq').remove();
                });
            });
        }

        async function fetchBandmateRelationship(bandmate: Bandmate): Promise<Bandmate> {
            return new Promise((resolve, reject) => {
                const iframe = $('<iframe id="iframe-bandmate-relationship" style="display:none;"></iframe>');
                $('body').append(iframe);
        
                const urlDomain = getUrlDomain();
                const url = `https://${urlDomain}/World/Popmundo.aspx/Interact/Details/${bandmate.id}`;
                $('#iframe-bandmate-relationship').attr('src', url);
        
                $('#iframe-bandmate-relationship').on('load', function () {
                    const iframeContents = $('#iframe-bandmate-relationship').contents();
        
                    try {
                        // Accessing rows by index instead of labels
                        const romanceElement = iframeContents.find('table.width100 tbody tr').eq(0).find('td').eq(1).find('span.sortkey');
                        const romance = parseInt(romanceElement.text().trim(), 10);
        
                        const friendshipElement = iframeContents.find('table.width100 tbody tr').eq(1).find('td').eq(1).find('span.sortkey');
                        const friendship = parseInt(friendshipElement.text().trim(), 10);
        
                        const hateElement = iframeContents.find('table.width100 tbody tr').eq(2).find('td').eq(1).find('span.sortkey');
                        const hate = parseInt(hateElement.text().trim(), 10);
        
                        bandmate.romance = !isNaN(romance) ? romance : 0;
                        bandmate.friendship = !isNaN(friendship) ? friendship : 0;
                        bandmate.hate = !isNaN(hate) ? hate : 0;
        
                        resolve(bandmate);
                    } catch (error) {
                        reject(new Error("Error extracting relationship data"));
                    }
        
                    $('#iframe-bandmate-relationship').remove();
                });
            });
        }
        

        async function fetchInstrumentQuality(instrument: Instrument): Promise<Instrument> {
            console.log(`Fetching quality for instrument: ${instrument.name} (ID: ${instrument.id})`);
            return new Promise((resolve) => {
                const iframeId = `iframe-instrument-quality-${instrument.id}`;
                const iframe = $(`<iframe id="${iframeId}" style="display:none;"></iframe>`);
                $('body').append(iframe);
        
                const urlDomain = getUrlDomain();
                const url = `https://${urlDomain}/World/Popmundo.aspx/Character/ItemDetails/${instrument.id}`;
                $(`#${iframeId}`).attr('src', url);
        
                $(`#${iframeId}`).on('load', function () {
                    const iframeContents = $(`#${iframeId}`).contents();
                    const qualityText = iframeContents.find('tr:contains("Qualidade") td:nth-child(2) a').attr('title') || iframeContents.find('tr:contains("Quality") td:nth-child(2) a').attr('title');
        
                    if (qualityText) {
                        const qualityValue = parseInt(qualityText.split('/')[0], 10);
                        instrument.quality = qualityValue;
                        console.log(`Quality fetched for instrument: ${instrument.name} (ID: ${instrument.id}) - Quality: ${qualityValue}`);
                    } else {
                        console.log(`Quality not found for instrument: ${instrument.name} (ID: ${instrument.id})`);
                    }
        
                    $(`#${iframeId}`).remove();
                    resolve(instrument);
                });
            });
        }
        
        async function fetchInstruments(bandmate: Bandmate): Promise<Instrument[]> {
            console.log(`Fetching instruments for bandmate: ${bandmate.name} (ID: ${bandmate.id})`);
            return new Promise((resolve) => {
                const iframeId = `iframe-instruments-${bandmate.id}`;
                const iframe = $(`<iframe id="${iframeId}" style="display:none;"></iframe>`);
                $('body').append(iframe);
        
                const urlDomain = getUrlDomain();
                const url = `https://${urlDomain}/World/Popmundo.aspx/Character/Items/${bandmate.id}`;
                $(`#${iframeId}`).attr('src', url);
        
                $(`#${iframeId}`).on('load', async function () {
                    const iframeContents = $(`#${iframeId}`).contents();
                    const rows = iframeContents.find('#checkedlist tbody tr');
                    const instruments: Instrument[] = [];
                    let isInstrumentGroup = false;
        
                    rows.each(function () {
                        const row = $(this);
        
                        if (row.hasClass('group') && row.find('td').text().trim() === 'Instrumentos musicais' || row.find('td').text().trim() === 'Musical Instrument') {
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
                                console.log(`Instrument added: ${name} (ID: ${id}) for bandmate: ${bandmate.name}`);
                            }
                        }
                    });
        
                    // Fetch qualities sequentially
                    for (const instrument of instruments) {
                        await fetchInstrumentQuality(instrument);
                    }
        
                    $(`#${iframeId}`).remove();
                    console.log(`Finished fetching instruments for bandmate: ${bandmate.name}`);
                    resolve(instruments);
                });
            });
        }
        
        async function loadBandmatesData() {
            setIsLoading(true);
        
            const initialBandmates = getBandmates();
        
            for (const bandmate of initialBandmates) {
                await fetchBandmateSq(bandmate);
                const instruments = await fetchInstruments(bandmate); // Wait for instruments with quality
                bandmate.instruments = instruments;
                await fetchBandmateRelationship(bandmate);
            }
        
            setBandmates(initialBandmates);
            setIsLoading(false);
        }
        

        loadBandmatesData();
    }, [artistId]);

    return { bandmates, isLoading };
}

export default useBandmate;
