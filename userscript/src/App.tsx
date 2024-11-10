// src/App.js
import React from 'react';
import Divider from '@mui/material/Divider';
import BoxDiv from './components/BoxDiv';
import FameAndPopularitySection from './components/FameAndPopularitySection';
import SinglesSection from './components/SinglesSection';
import BandmatesSection from './components/BandmatesSection';
import ShowsSection from './components/ShowsSection';
import DrinkwaterIcon from './components/drinkwaterIcon';
import DrinkwaterPng from './assets/icons/drinkwater.png';

function App() {

    return (
        <BoxDiv title="Artist's Dashboard" togglable={false} >
           
            <FameAndPopularitySection />
            <Divider sx={{ margin: 1 }} />
            <ShowsSection />
            <Divider sx={{ margin: 1 }} />
            <SinglesSection />
            <Divider sx={{ margin: 1 }} />
            <BandmatesSection />
            <img src={DrinkwaterPng} width={100} alt="Drinkwater" />
        </BoxDiv>
    );
}

export default App;
