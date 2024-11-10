// src/components/ShowsSection.tsx
import React from 'react';
import BoxDiv from './BoxDiv';
import Skeleton from '@mui/material/Skeleton';
import useGlobalPopularityAndFame from '../hooks/useGlobalPopularityAndFame';
import useSegmentation from '../hooks/useSegmentation';
import useShow from '../hooks/useShows';


const ShowsSection: React.FC = () => {
    const { showsList, isLoading } = useShow();

    // Calcula a média de popularidade e fama
    const totalSales = showsList.reduce((acc, item) => acc + item.sales, 0);
    const totalShows = showsList.length;
    const avgSales = showsList.length > 0 ? totalSales / totalShows : 0;

    // Ordena a lista para obter top e worst 4
    const top4Sales = [...showsList].sort((a, b) => b.sales - a.sales).slice(0, 4);
    const worst4Sales = [...showsList].sort((a, b) => a.sales - b.sales).slice(0, 4);

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
            <BoxDiv title="Shows Resume">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) : (
                    <table>
                        <tbody>
                            <tr>
                                <td><b>Total Shows</b></td>
                                <td>{totalShows}</td>
                            </tr>
                            <tr>
                                <td><b>Total Sales</b></td>
                                <td>{totalSales}</td>
                            </tr>
                            <tr>
                                <td><b>Avg Sales</b></td>
                                <td>{avgSales.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </BoxDiv>

            <BoxDiv title="Top 4 sales">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) :
                    top4Sales.map((show, index) => (
                        <div key={show.id}>
                            {index + 1}. <b>{show.city}</b>: {show.sales}
                        </div>
                    ))
                }
            </BoxDiv>

            <BoxDiv title="Worst 4 sales">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) :
                    worst4Sales.map((show, index) => (
                        <div key={show.id}>
                            {index + 1}. <b>{show.city}</b>: {show.sales}
                        </div>
                    ))
                }
            </BoxDiv>
        </div>
    );
};

export default ShowsSection;
