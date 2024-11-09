// src/App.js
import React from 'react';
import Divider from '@mui/material/Divider';
import BoxDiv from './components/BoxDiv';
import Skeleton from '@mui/material/Skeleton';
import useSingles from './hooks/useSingles';
import FameAndPopularitySection from './components/FameAndPopularitySection';
import SinglesSection from './components/SinglesSection';
import BandmatesSection from './components/BandmatesSection';

function App() {

    return (
        <BoxDiv title="Artist's Dashboard" togglable={false} >
            <FameAndPopularitySection />
            <Divider sx={{ margin: 1 }} />
            <SinglesSection />
            <Divider sx={{ margin: 1 }} />
            <BandmatesSection />
        </BoxDiv>
    );
}

export default App;
