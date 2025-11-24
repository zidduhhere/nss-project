import React from 'react';

interface CoreTeamLeftProps {
    title?: string;
    subtitle?: string;
    note?: string;
}

export const CoreTeamLeft: React.FC<CoreTeamLeftProps> = ({
    title = 'NSS Core Team',
    subtitle = 'Meet the dedicated head team coordinating initiatives, guiding volunteers, and ensuring every activity creates lasting community impact.',
    note = 'Profiles auto-rotate every 5 seconds. Hover or focus to pause. Use dots to jump.'
}) => {
    return (
        <div className="space-y-6 max-w-xl mx-auto self-start text-start lg:text-left lg:col-span-4">
            <div>
                <h2 className="text-3xl md:text-4xl font-isans font-semibold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-800 text-lg leading-relaxed">{subtitle}</p>
            </div>
            <p className="text-sm text-gray-500">{note}</p>
        </div>
    );
};
