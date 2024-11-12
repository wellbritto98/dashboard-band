import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Skeleton } from '@mui/material';
import useAlbums from '../hooks/useAlbums';
import { BarChart, PieChart } from '@mui/x-charts';
import BoxDiv from './BoxDiv';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';

const AlbumsSection: React.FC = () => {
    const { albums, isLoading: isLoadingAlbums } = useAlbums();
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const chartSetting = {
        xAxis: [
            {
                label: 'Total Sales',
            },
        ],
        width: 500,
        height: 400,
    };
    // Filtra albums para remover aqueles com `lastSell` inexistente ou igual a zero
    const filteredAlbums = albums.filter(album => album.lastSell && album.lastSell > 0);

    return (
        <BoxDiv title="Albums">
            {isLoadingAlbums ? (
                <div>
                    <Skeleton variant="circular" width={100} height={100} />
                </div>
            ) : (
                <TabContext value={value}>
                    <TabList variant="fullWidth" onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Last Sells" value="1" />
                        <Tab label="Storage" value="2" />
                        <Tab label="Total Sells" value="3" />
                    </TabList>
                    <TabPanel value="1">
                        <Typography variant="h6">
                            Sales on {filteredAlbums.length > 0 ? filteredAlbums[0].lastSellDate.toLocaleDateString() : 'Data não disponível'}
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: filteredAlbums.map((album, index) => ({
                                        id: index,
                                        value: album.lastSell,
                                        label: album.title,
                                    })),
                                    highlightScope: { fade: 'global', highlight: 'item' },

                                },
                            ]}
                            height={150}
                        />
                    </TabPanel>
                    <TabPanel value="2">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Album</TableCell>
                                    <TableCell align="right">Remaining Stock</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAlbums.map((album) => (
                                    <TableRow key={album.title}>
                                        <TableCell>{album.title}</TableCell>
                                        <TableCell align="right">{album.stock}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabPanel>

                    <TabPanel value="3">

                        <BarChart
                            sx={{
                                "& .MuiChartsLegend-series text": { fontSize: "0.7em !important" },
                                "& .MuiChartsAxis-tickLabel": { fontSize: "0.7em !important" }
                            }}
                            series={[
                                {
                                    data: filteredAlbums.map(album => album.sells),
                                },
                            ]}
                            xAxis={[{
                                scaleType: 'band',
                                data: filteredAlbums.map(album => {
                                    const maxLabelLength = 7; // Define the maximum number of characters
                                    return album.title.length > maxLabelLength
                                        ? `${album.title.slice(0, maxLabelLength)}...`
                                        : album.title;
                                }),
                            }]}
                            height={200}
                            layout="vertical"
                        />


                    </TabPanel>
                </TabContext>
            )}
        </BoxDiv>
    );
};

export default AlbumsSection;
