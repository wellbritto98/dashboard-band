import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Skeleton } from '@mui/material';
import useSingles from '../hooks/useSingles';
import { BarChart, PieChart } from '@mui/x-charts';
import BoxDiv from './BoxDiv';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';

const SinglesSection: React.FC = () => {
    const { singles, isLoading: isLoadingSingles } = useSingles();
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
    // Filtra singles para remover aqueles com `lastSell` inexistente ou igual a zero
    const filteredSingles = singles.filter(single => single.lastSell && single.lastSell > 0);

    return (
        <BoxDiv title="Singles">
            {isLoadingSingles ? (
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
                            Vendas em {filteredSingles.length > 0 ? filteredSingles[0].lastSellDate.toLocaleDateString() : 'Data não disponível'}
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: filteredSingles.map((single, index) => ({
                                        id: index,
                                        value: single.lastSell,
                                        label: single.title,
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
                                    <TableCell>Single</TableCell>
                                    <TableCell align="right">Remaining Stock</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSingles.map((single) => (
                                    <TableRow key={single.title}>
                                        <TableCell>{single.title}</TableCell>
                                        <TableCell align="right">{single.stock}</TableCell>
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
                                    data: filteredSingles.map(single => single.sells),
                                },
                            ]}
                            xAxis={[{
                                scaleType: 'band',
                                data: filteredSingles.map(single => {
                                    const maxLabelLength = 7; // Define the maximum number of characters
                                    return single.title.length > maxLabelLength
                                        ? `${single.title.slice(0, maxLabelLength)}...`
                                        : single.title;
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

export default SinglesSection;
