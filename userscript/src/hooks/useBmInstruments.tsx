// src/hooks/useInstruments.tsx
import { useState, useEffect } from 'react';
import $ from 'jquery';
import { Instrument, InstrumentImpl } from '../shared/interfaces/instrument';

function useInstruments(charId: number) {
   
    const [isLoadingInstruments, setIsLoadingInstruments] = useState(true);

    useEffect(() => {
        if (!charId) return;

        function getUrlDomain() {
            return window.location.hostname;
        }

        

       

        fetchInstruments();
    }, [charId]);

    return { instrumentsList, isLoadingInstruments };
}

export default useInstruments;
