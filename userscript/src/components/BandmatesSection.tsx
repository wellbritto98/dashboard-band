import React from 'react';
import { Typography } from '@mui/material';
import { Skeleton } from '@mui/material';
import BoxDiv from './BoxDiv';
import useBandmate from '../hooks/useBandMate';
import { Bandmate } from '../shared/interfaces/bandmate';

const BandmatesSection: React.FC = () => {
    const { bandmates, isLoading: isLoadingBandmates } = useBandmate();

    // Ordena os bandmates pelo valor de SQ em ordem decrescente
    const sortedBandmates = [...bandmates].sort((a, b) => b.sq - a.sq);

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
            <BoxDiv title="Bandmates' Details" toggleOpen={false}>
                {isLoadingBandmates ? (
                    <div>
                        Esta tarefa pode demorar um pouco mais. Mas não se preocupe, estamos colhendo as informações!
                        <Skeleton variant="rectangular" width={300} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={300} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={300} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>Name</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>SQ</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>Friend</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>Love</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBandmates.map((bandmate, index) => (
                                <tr key={index}>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '4px' }}>{bandmate.name.split(' ')[0]}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '4px' }}>{bandmate.sq}%</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '4px' }}>{bandmate.friendship}%</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '4px' }}>{bandmate.romance}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </BoxDiv>


            <BoxDiv title="Bandmates's Instruments" toggleOpen={false}>
                {isLoadingBandmates ? (
                    <div>
                        Esta tarefa pode demorar um pouco mais. Mas não se preocupe, estamos colhendo as informações!
                        <Skeleton variant="rectangular" width={300} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={300} height={20} style={{ marginTop: 8 }} />
                        <Skeleton variant="rectangular" width={300} height={20} style={{ marginTop: 8 }} />
                    </div>
                ) : (
                    sortedBandmates.map((bandmate, index) => (
                        <div key={index}>
                            {bandmate.name.split(' ')[0]}:{" "}
                            {(bandmate.instruments || []).map((inst, i) => (
                                <span key={i}>
                                    {inst.name}(<strong>{inst.quality}</strong>)
                                    {i < (bandmate.instruments?.length || 0) - 1 && ', '}
                                </span>
                            ))}
                        </div>
                    ))
                )}
            </BoxDiv>


        </div>
    );
};

export default BandmatesSection;