// src/components/FameAndPopularitySection.tsx
import React from 'react';
import BoxDiv from './BoxDiv';
import Skeleton from '@mui/material/Skeleton';
import useGlobalPopularityAndFame from '../hooks/useGlobalPopularityAndFame';
import useSegmentation from '../hooks/useSegmentation';

const FameAndPopularitySection: React.FC = () => {
    const { popularityList, isLoading } = useGlobalPopularityAndFame();
    const { segmentationList, isLoadingSegmentation } = useSegmentation();

    // Calcula a média de popularidade e fama
    const totalPopularity = popularityList.reduce((acc, item) => acc + item.popularity, 0);
    const totalFame = popularityList.reduce((acc, item) => acc + item.fame, 0);
    const avgPopularity = popularityList.length > 0 ? totalPopularity / popularityList.length : 0;
    const avgFame = popularityList.length > 0 ? totalFame / popularityList.length : 0;

    // Ordena a lista para obter top e last 4
    const top4Fame = [...popularityList].sort((a, b) => b.fame - a.fame).slice(0, 4);
    const last4Fame = [...popularityList].sort((a, b) => a.fame - b.fame).slice(0, 4);
    const top4Popularity = [...popularityList].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    const last4Popularity = [...popularityList].sort((a, b) => a.popularity - b.popularity).slice(0, 4);

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
            <BoxDiv title="Artist Popularity">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) : (
                    <table>
                        <tbody>
                            <tr>
                                <td><b>Global Pop</b></td>
                                <td>{avgPopularity.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td><b>Global Fame</b></td>
                                <td>{avgFame.toFixed(2)}%</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </BoxDiv>

            <BoxDiv title="Top 4 city fame">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) :
                    top4Fame.map((popularity, index) => (
                        <div key={index}>
                            {index + 1}. <b>{popularity.city}</b>: {popularity.fame}%
                        </div>
                    ))
                }
            </BoxDiv>

            <BoxDiv title="Last 4 city fame">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) :
                    last4Fame.map((popularity, index) => (
                        <div key={index}>
                            {index + 1}. <b>{popularity.city}</b>: {popularity.fame}%
                        </div>
                    ))
                }
            </BoxDiv>

            <BoxDiv title="Top 4 city Pop">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) :
                    top4Popularity.map((popularity, index) => (
                        <div key={index}>
                            {index + 1}. <b>{popularity.city}</b>: {popularity.popularity}
                        </div>
                    ))
                }
            </BoxDiv>

            <BoxDiv title="Last 4 city Pop">
                {isLoading ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) :
                    last4Popularity.map((popularity, index) => (
                        <div key={index}>
                            {index + 1}. <b>{popularity.city}</b>: {popularity.popularity}
                        </div>
                    ))
                }
            </BoxDiv>

            <BoxDiv title="Market Segmentation">
                {isLoadingSegmentation ? (
                    <div>
                        <Skeleton variant="rectangular" width={50} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={50} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) : (
                    <table>
                        <tbody>
                            {segmentationList.map((segmentation, index) => (
                                <tr key={index}>
                                    <td>{segmentation.segmentation}:</td>
                                    <td>{segmentation.value}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </BoxDiv>
        </div>
    );
};

export default FameAndPopularitySection;
