import React, { useState } from 'react';
import BoxDiv from './BoxDiv';
import Skeleton from '@mui/material/Skeleton';
import useShow from '../hooks/useShows';
import { Slider, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br'); // Configura a localidade para português (Brasil)

const ShowsSection: React.FC = () => {
    const { showsList, isLoading } = useShow();

    // Estados para controle de data e quantidade de vendas
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [numWorstShows, setNumWorstShows] = useState<number>(4);

    // Função para filtrar shows dentro do intervalo de datas
    const filteredShows = showsList.filter(show => {
        const showDate = dayjs(show.date);
        return (!startDate || showDate.isAfter(startDate, 'day') || showDate.isSame(startDate, 'day')) &&
               (!endDate || showDate.isBefore(endDate, 'day') || showDate.isSame(endDate, 'day'));
    });

    // Ordena a lista para obter as piores e melhores vendas
    const worstSales = [...filteredShows].sort((a, b) => a.sales - b.sales).slice(0, numWorstShows);
    const top4Sales = [...showsList].sort((a, b) => b.sales - a.sales).slice(0, 4);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <div style={{ display: "flex", flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>

                {/* Resumo dos Shows */}
                <BoxDiv title="Shows Infow">
                    {isLoading ? (
                        <Skeleton variant="rectangular" width={50} height={20} />
                    ) : (
                        <table>
                            <tbody>
                                <tr>
                                    <td><b>Total Shows</b></td>
                                    <td>{showsList.length}</td>
                                </tr>
                                <tr>
                                    <td><b>Total Sales</b></td>
                                    <td>{showsList.reduce((acc, show) => acc + show.sales, 0)}</td>
                                </tr>
                                <tr>
                                    <td><b>Avg Sales</b></td>
                                    <td>{(showsList.reduce((acc, show) => acc + show.sales, 0) / showsList.length).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </BoxDiv>

                {/* Exibição dos shows com as melhores vendas filtradas */}
                <BoxDiv title="Top 4 Sales">
                    {isLoading ? (
                        <Skeleton variant="rectangular" width={50} height={20} />
                    ) :
                        top4Sales.map((show, index) => (
                            <div key={show.id}>
                                {index + 1}. {dayjs(show.date).format('DD/MM/YYYY HH:mm')} - <b>{show.city}</b>: {show.sales}
                            </div>
                        ))
                    }
                </BoxDiv>

                {/* Exibição dos shows com as piores vendas filtradas */}
                <BoxDiv title="Least Sold Shows">
                    {isLoading ? (
                        <Skeleton variant="rectangular" width={50} height={20} />
                    ) : (
                        <>
                        <Typography variant='h3' gutterBottom>Filter by period</Typography>
                            <div style={{ marginBottom: 14, display: "flex", flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>

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

                            <Typography variant='h3' gutterBottom>Choose the number of shows to Display</Typography>
                            <Slider
                                value={numWorstShows}
                                onChange={(event, newValue) => setNumWorstShows(newValue as number)}
                                aria-labelledby="worst-shows-slider"
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                            />

                            {worstSales.map((show, index) => (
                                <div key={show.id}>
                                    {index + 1}. {dayjs(show.date).format('DD/MM/YYYY HH:mm')} - <b>{show.city}</b>: {show.sales}
                                </div>
                            ))}
                        </>
                    )}
                </BoxDiv>
            </div>
        </LocalizationProvider>
    );
};

export default ShowsSection;
