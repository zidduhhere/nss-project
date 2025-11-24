import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { VolunteerDetailsOverlay } from '../../../components/common';
import { FilledButton, Table } from '../../../components/ui';
import { Filter, Search, Download, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVolunteerColumns } from '@/utils/tableStrucutre';
import { useUnitVolunteerManagement } from '@/hooks/useUnitVolunteerManagement';
import { VolunteerProfile } from '@/services/profileService';
import SuccessModal from '@/components/common/SuccessModal';
import ErrorPop from '@/components/common/ErrorPop';

interface UnitVolunteersProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitVolunteers({ }: UnitVolunteersProps) {
    // Use the unit volunteer management hook
    const {
        volunteers,
        isLoading,
        error,
        successMessage,
        refetch,
        applyFilters,
        clearSuccessMessage,
        clearError,
    } = useUnitVolunteerManagement();

    // State for volunteer details overlay
    const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Local filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');

    // Handle view volunteer details
    const handleViewVolunteer = (volunteer: VolunteerProfile) => {
        setSelectedVolunteer(volunteer);
        setIsOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
        setSelectedVolunteer(null);
    };

    // Apply filters to backend when local filters change
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            applyFilters({
                search: searchQuery || undefined,
                course: courseFilter || undefined,
                semester: semesterFilter ? parseInt(semesterFilter) : undefined,
            });
        }, 300); // Debounce search input

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, courseFilter, semesterFilter, applyFilters]);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                clearSuccessMessage();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, clearSuccessMessage]);

    // Get unique courses and semesters for filters from all volunteers
    const uniqueCourses = Array.from(new Set(volunteers.map(v => v.course).filter(Boolean))) as string[];
    const uniqueSemesters = Array.from(new Set(volunteers.map(v => v.semester).filter(Boolean))).sort() as number[];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />

            {/* Success Modal */}
            {successMessage && (
                <SuccessModal
                    title="Success"
                    message={successMessage}
                />
            )}

            {/* Error Alert */}
            {error && (
                <ErrorPop
                    error={error}
                    onCloseClick={clearError}
                />
            )}

            <div className="space-y-6 px-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or KTU ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select 
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Courses</option>
                                {uniqueCourses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                            <select 
                                value={semesterFilter}
                                onChange={(e) => setSemesterFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Semesters</option>
                                {uniqueSemesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
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
                            <FilledButton
                                variant='primary'
                                size='md'
                                className='flex flex-row justify-center items-center gap-2'
                            >

                                <Download className="h-4 w-4" />
                                <span>Export</span>

                            </FilledButton>
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
                                    {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}
                                </span>
                                <button 
                                    onClick={refetch}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-gray-600">Loading volunteers...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-gray-800 font-semibold mb-2">Failed to Load Volunteers</p>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={refetch}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <Table
                            data={volunteers}
                            columns={getVolunteerColumns(handleViewVolunteer)}
                            emptyMessage={searchQuery || courseFilter || semesterFilter ? "No volunteers match your filters" : "No volunteers registered yet"}
                        />
                    )}
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
