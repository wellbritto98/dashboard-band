// src/App.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';
import BoxDiv from './components/BoxDiv';
import FameAndPopularitySection from './components/FameAndPopularitySection';
import SinglesSection from './components/SinglesSection';
import BandmatesSection from './components/BandmatesSection';
import ShowsSection from './components/ShowsSection';
import DrinkwaterPng from './assets/icons/drinkwater.png';
import $ from 'jquery';
import { removeIframeId, setIframeId } from './redux/iframeSlice';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import AlbumsSection from './components/AlbumsSection';

function App() {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState('1');
    const [value2, setValue2] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleChange2 = (event: React.SyntheticEvent, newValue: string) => {
        setValue2(newValue);
    }

    useEffect(() => {
        // Criação do iframe
        const iframeId = 'iframe-bandmate-data';
        let iframe = $(`#${iframeId}`);

        if (iframe.length === 0) {
            iframe = $('<iframe>', { id: iframeId, style: 'display:none;' });
            iframe.attr('sandbox', 'allow-same-origin');
            $('body').append(iframe);
            dispatch(setIframeId(iframeId));
        }

        // Remover iframe ao desmontar
        return () => {
            iframe.remove();
            dispatch(removeIframeId());
        };
    }, [dispatch]);

    return (
        <BoxDiv title="Artist's Dashboard" togglable={false} >
            {/* centralize the image */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={DrinkwaterPng} width={100} alt="Drinkwater" />
            </div><TabContext value={value2}>
                <TabList
                    variant="fullWidth"
                    onChange={handleChange2}
                    indicatorColor="secondary"
                    textColor="inherit"
                    aria-label="lab API tabs example"
                    sx={{
                        backgroundColor: '#63767f',
                        backgroundImage: `url('https://75.popmundo.com/Static/Css/Theme/Default/Images/bgr-item-header.png')`,
                        backgroundRepeat: 'repeat-x',
                        color: '#ffffff',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ffffff'
                        },
                        '& .MuiTab-root': {
                            color: '#ffffff'
                        }
                    }}
                >
                    <Tab sx={{ fontSize: 12 }} label="Pop and Fame" value="1" />
                    <Tab sx={{ fontSize: 12 }} label="Shows" value="2" />
                </TabList>
                <TabPanel value="1" sx={{ paddingX: 0, backgroundColor: '#e5e5e5' }}> {/* Fundo dos TabPanels definido */}
                    <FameAndPopularitySection />
                </TabPanel>
                <TabPanel value="2" sx={{ paddingX: 0, backgroundColor: '#e5e5e5' }}> {/* Fundo dos TabPanels definido */}
                    <ShowsSection />
                </TabPanel>
            </TabContext>

            <Divider sx={{ margin: 1 }} />
            <TabContext value={value}>
                <TabList
                    variant="fullWidth"
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    aria-label="lab API tabs example"
                    sx={{
                        backgroundColor: '#63767f',
                        backgroundImage: `url('https://75.popmundo.com/Static/Css/Theme/Default/Images/bgr-item-header.png')`,
                        backgroundRepeat: 'repeat-x',
                        color: '#ffffff',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ffffff'
                        },
                        '& .MuiTab-root': {
                            color: '#ffffff'
                        }
                    }}
                >
                    <Tab sx={{ fontSize: 12 }} label="Singles" value="1" />
                    <Tab sx={{ fontSize: 12 }} label="Albums" value="2" />
                </TabList>
                <TabPanel value="1" sx={{ paddingX: 0, backgroundColor: '#e5e5e5' }}> {/* Fundo dos TabPanels definido */}
                    <SinglesSection />
                </TabPanel>
                <TabPanel value="2" sx={{ paddingX: 0, backgroundColor: '#e5e5e5' }}> {/* Fundo dos TabPanels definido */}
                    <AlbumsSection />
                </TabPanel>
            </TabContext>


            <Divider sx={{ margin: 1 }} />
            <BandmatesSection />
        </BoxDiv>

    );
}

export default App;
