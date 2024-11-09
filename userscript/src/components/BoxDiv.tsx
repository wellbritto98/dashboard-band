import { Icon } from '@mui/material';
import React, { ReactNode, useState } from 'react';


interface BoxDivProps {
    title: string;
    children: ReactNode;
    toggleOpen?: boolean;
    togglable?: boolean;
}

const BoxDiv: React.FC<BoxDivProps> = ({ title, children, toggleOpen = true, togglable = true }) => {
    const [isOpen, setIsOpen] = useState(toggleOpen);

    const toggleBody = () => {
        if (togglable) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="box">
            <h2 onClick={toggleBody} style={{ cursor: togglable ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}>
                {title}
                <Icon style={{ marginLeft: '2px' }}>
                    {isOpen ? 'expand_more' : 'chevron_right'}
                </Icon>
            </h2>
            {isOpen && (
                <div className="dashboard-body">
                    {children}
                </div>
            )}
        </div>
    );
};

export default BoxDiv;
