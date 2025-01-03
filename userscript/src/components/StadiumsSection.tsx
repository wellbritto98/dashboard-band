import React, { useState } from 'react';
import BoxDiv from './BoxDiv';
import Skeleton from '@mui/material/Skeleton';
import useShow from '../hooks/useShows';
import { Slider, Typography, TextField, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useGlobalPopularityAndFame from '../hooks/useGlobalPopularityAndFame';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br'); // Configura a localidade para português (Brasil)

const StadiumsSection: React.FC = () => {
    const { showsList, isLoading: isShowsLoading } = useShow();
    const { popularityList, isLoading: isPopularityLoading } = useGlobalPopularityAndFame();
    const [sortColumn, setSortColumn] = useState<string>('popularity');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    
    // Estados para controle de data e quantidade de vendas
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [numShows, setNumShows] = useState<number>(4);
    const [filterTextTop, setFilterTextTop] = useState<string>('');
    const [filterTextWorst, setFilterTextWorst] = useState<string>('');

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Filtrar shows por período e estádio
    const filteredShows = showsList.filter(show => {
        const showDate = dayjs(show.date);
        return show.isStadium &&
            (!startDate || showDate.isAfter(startDate, 'day') || showDate.isSame(startDate, 'day')) &&
            (!endDate || showDate.isBefore(endDate, 'day') || showDate.isSame(endDate, 'day'));
    });

    // Lista ordenada de popularidade e fama
    const sortedList = [...popularityList]
        .filter((pop) => filteredShows.some((show) => show.city === pop.city))
        .sort((a, b) => {
            if (sortColumn === 'popularity') {
                return sortDirection === 'asc' ? a.popularity - b.popularity : b.popularity - a.popularity;
            } else if (sortColumn === 'fame') {
                return sortDirection === 'asc' ? a.fame - b.fame : b.fame - a.fame;
            } else if (sortColumn === 'city') {
                return sortDirection === 'asc' ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city);
            } else {
                return 0;
            }
        });

    // Filtrar por texto e quantidade de shows
    const filteredTopSales = [...filteredShows]
        .sort((a, b) => b.sales - a.sales)
        .filter(show => show.city.toLowerCase().includes(filterTextTop.toLowerCase()))
        .slice(0, numShows);

    const filteredWorstSales = [...filteredShows]
        .sort((a, b) => a.sales - b.sales)
        .filter(show => show.city.toLowerCase().includes(filterTextWorst.toLowerCase()))
        .slice(0, numShows);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <div style={{ display: "flex", flexDirection: "column", gap: 14, justifyContent: "center", alignItems: "center", width: "100%" }}>
                <BoxDiv title="Stadiums Ranking">
                    {isShowsLoading ? (
                        <Skeleton variant="rectangular" width={300} height={50} />
                    ) : (
                        <>
                            <Typography variant='h3' gutterBottom>Filter by Period</Typography>
                            <div style={{ marginBottom: 14, display: "flex", flexDirection: "row", gap: 14 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </div>

                            <Typography variant='h3' gutterBottom>Choose the Number of Shows to Display</Typography>
                            <Slider
                                value={numShows}
                                onChange={(event, newValue) => setNumShows(newValue as number)}
                                aria-labelledby="shows-slider"
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                            />

                            <Typography variant='h6' gutterBottom>Top {numShows} Sales</Typography>
                            <TextField
                                label="Filter by City"
                                value={filterTextTop}
                                onChange={(e) => setFilterTextTop(e.target.value)}
                                size="small"
                                fullWidth
                                margin="dense"
                            />
                            {filteredTopSales.map((show, index) => (
                                <div key={show.id}>
                                    {index + 1}. {dayjs(show.date).format('DD/MM/YYYY HH:mm')} - <b>{show.city}</b>: {show.sales}
                                </div>
                            ))}

                            <Divider style={{ margin: "10px 0" }} />

                            <Typography variant='h6' gutterBottom>Least Sold {numShows} Shows</Typography>
                            <TextField
                                label="Filter by City"
                                value={filterTextWorst}
                                onChange={(e) => setFilterTextWorst(e.target.value)}
                                size="small"
                                fullWidth
                                margin="dense"
                            />
                            {filteredWorstSales.map((show, index) => (
                                <div key={show.id}>
                                    {index + 1}. {dayjs(show.date).format('DD/MM/YYYY HH:mm')} - <b>{show.city}</b>: {show.sales}
                                </div>
                            ))}
                            <Divider style={{ margin: "10px 0" }} />
                            <Typography variant="h6" gutterBottom>Fame and Popularity</Typography>
                            {isPopularityLoading ? (
                                <Skeleton variant="rectangular" width={300} height={50} />
                            ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                                    <thead>
                                        <tr>
                                            <th
                                                style={{ border: "1px solid #ddd", padding: 8, textAlign: "left", cursor: "pointer" }}
                                                onClick={() => handleSort('city')}
                                            >
                                                City {sortColumn === 'city' && (sortDirection === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th
                                                style={{ border: "1px solid #ddd", padding: 8, textAlign: "left", cursor: "pointer" }}
                                                onClick={() => handleSort('popularity')}
                                            >
                                                Popularity {sortColumn === 'popularity' && (sortDirection === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th
                                                style={{ border: "1px solid #ddd", padding: 8, textAlign: "left", cursor: "pointer" }}
                                                onClick={() => handleSort('fame')}
                                            >
                                                Fame {sortColumn === 'fame' && (sortDirection === 'asc' ? '↑' : '↓')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedList.map((pop, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid #ddd", padding: 8 }}>{pop.city}</td>
                                                <td style={{ border: "1px solid #ddd", padding: 8 }}>{pop.popularity}</td>
                                                <td style={{ border: "1px solid #ddd", padding: 8 }}>{pop.fame}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                        </>
                    )}
                </BoxDiv>
            </div>
        </LocalizationProvider>
    );
};

export default StadiumsSection;
