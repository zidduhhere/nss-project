import { Placeholder } from './Placeholder';

interface UnitInfoCardProps {
    className?: string;
}

export const UnitInfoCard = ({ className = '' }: UnitInfoCardProps) => {
    // Demo unit information
    const unitInfo = {
        unitNumber: "NSS-309",
        coordinatorName: "Dr. Rajesh Kumar",
        coordinatorDesignation: "Program Coordinator",
        college: "Government Engineering College"
    };

    return (
        <div className={`md:h-18 bg-white rounded-xl shadow-sm border border-gray-200 p-2 ${className} hover:shadow-md transform transition-transform duration-300 hover:translate-y-1`}>
            <div className="flex items-start space-x-4">
                {/* Coordinator Profile Picture */}
                <div className="flex flex-col justify-center items-center">
                    <Placeholder
                        size="avatar"
                        label="Coordinator"
                        className="w-9 h-9 rounded-full "
                    />
                </div>

                {/* Unit Information */}
                <div className="flex-1 flex-row min-w-0">
                    <div className="flex flex-col items-start space-y-1 mb-1">

                        <span className="text-sm font-mono text-start text-black bg-gray-100 px-2  rounded">
                            {unitInfo.unitNumber}
                        </span>
                    </div>

                    <div className="flex flex-col items-start space-y-1 mb-1">
                        <div>
                            <p className="text-sm text-start font-semibold text-gray-900 truncate">
                                {unitInfo.coordinatorName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {unitInfo.coordinatorDesignation}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">

                        <p className="text-xs text-start text-gray-500 truncate">
                            {unitInfo.college}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
