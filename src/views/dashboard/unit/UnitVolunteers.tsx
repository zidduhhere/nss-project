import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { VolunteerDetailsOverlay } from '../../../components/common';
import { Table } from '../../../components/ui';
import { demoVolunteers, Volunteer } from '@/assets/utils/volunteers';
import { Filter, Search, Download } from 'lucide-react';
import { useState } from 'react';
import { getVolunteerColumns } from '@/utils/tableStrucutre';

interface UnitVolunteersProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitVolunteers({ }: UnitVolunteersProps) {
    // State for volunteer details overlay
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Filter state


    // Handle view volunteer details
    const handleViewVolunteer = (volunteer: Volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
        setSelectedVolunteer(null);
    };

    // Define volunteer table columns based on VolunteerSchema


    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search volunteers..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Courses</option>
                                <option value="cse">Computer Science</option>
                                <option value="ece">Electronics & Communication</option>
                                <option value="me">Mechanical</option>
                                <option value="it">Information Technology</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Semesters</option>
                                <option value="S1-S2">Semester S1-S2</option>
                                <option value="S3-S4">Semester S3-S4</option>
                                <option value="S5-S6">Semester S5-S6</option>
                                <option value="S7-S8">Semester S7-S8</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                // onClick={() => setIsFilterOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Volunteers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">NSS Volunteers Directory</h3>
                                <p className="text-sm text-gray-600 mt-1">Complete list of registered volunteers in your unit</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">
                                    {demoVolunteers.length} total volunteers
                                </span>
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                                    Add Volunteer
                                </button>
                            </div>
                        </div>
                    </div>
                    <Table
                        data={demoVolunteers}
                        columns={getVolunteerColumns(handleViewVolunteer)}
                        emptyMessage="No volunteers registered yet"
                    />
                </div>
            </div>


            {/* Volunteer Details Overlay */}
            <VolunteerDetailsOverlay
                volunteer={selectedVolunteer}
                isOpen={isOverlayOpen}
                onClose={handleCloseOverlay}
            />
        </div>
    );
}
