import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard } from '../../../components/common';
import { Table } from '../../../components/ui';
import { demoStudents, Student } from '@/assets/utils/students';
import { Users, Mail, Phone, GraduationCap, Calendar, BookOpen, Filter, Search, Download, X, Check } from 'lucide-react';
import { useState } from 'react';

interface UnitVolunteersProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitVolunteers({ }: UnitVolunteersProps) {

    // Filter state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        courses: {
            'Computer Science Engineering': false,
            'Electronics & Communication Engineering': false,
            'Mechanical Engineering': false,
            'Information Technology': false,
            'Electrical & Electronics Engineering': false,
            'Civil Engineering': false
        },
        semesters: {
            '1-2': false,
            '3-4': false,
            '5-6': false,
            '7-8': false
        },
        status: {
            'Active': false,
            'Inactive': false,
            'New': false
        }
    });

    const handleFilterChange = (category: keyof typeof filters, option: string) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [option]: !prev[category][option as keyof typeof prev[typeof category]]
            }
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            courses: {
                'Computer Science Engineering': false,
                'Electronics & Communication Engineering': false,
                'Mechanical Engineering': false,
                'Information Technology': false,
                'Electrical & Electronics Engineering': false,
                'Civil Engineering': false
            },
            semesters: {
                '1-2': false,
                '3-4': false,
                '5-6': false,
                '7-8': false
            },
            status: {
                'Active': false,
                'Inactive': false,
                'New': false
            }
        });
    };

    const applyFilters = () => {
        setIsFilterOpen(false);
        // Here you would implement the actual filtering logic
        console.log('Applied filters:', filters);
    };

    const volunteerColumns = [
        {
            key: 'name' as keyof Student,
            header: 'Volunteer Name',
            width: '20%',
            render: (value: string) => (
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {value.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            )
        },
        {
            key: 'email' as keyof Student,
            header: 'Email',
            width: '20%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value}</span>
                </div>
            )
        },
        {
            key: 'phoneNumber' as keyof Student,
            header: 'Phone',
            width: '15%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value}</span>
                </div>
            )
        },
        {
            key: 'course' as keyof Student,
            header: 'Course',
            width: '20%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value}</span>
                </div>
            )
        },
        {
            key: 'semester' as keyof Student,
            header: 'Semester',
            width: '10%',
            render: (value: number) => (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Sem {value}
                </span>
            )
        },
        {
            key: 'id' as keyof Student,
            header: 'Actions',
            width: '15%',
            render: () => (
                <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Contact
                    </button>
                </div>
            )
        }
    ];

    const stats = [
        { label: 'Total Volunteers', value: demoStudents.length, icon: Users, color: 'bg-nss-500' },
        { label: 'Active This Month', value: Math.floor(demoStudents.length * 0.8), icon: Calendar, color: 'bg-nss-500' },
        { label: 'New Registrations', value: 3, icon: GraduationCap, color: 'bg-nss-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-6">
                {/* Header */}
                <div className="flex items-start justify-end ">


                    {/* Unit Info Card */}
                    <UnitInfoCard className="w-80 flex-shrink-0" />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
                                <option value="1">Semester 1-2</option>
                                <option value="3">Semester 3-4</option>
                                <option value="5">Semester 5-6</option>
                                <option value="7">Semester 7-8</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Volunteers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">NSS Volunteers Directory</h3>
                        <p className="text-sm text-gray-600 mt-1">Complete list of registered volunteers</p>
                    </div>
                    <Table data={demoStudents} columns={volunteerColumns} />
                </div>
            </div>

            {/* Filter Overlay */}
            {isFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="p-6 space-y-6">
                            {/* Courses Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Courses</h4>
                                <div className="space-y-2">
                                    {Object.entries(filters.courses).map(([course, checked]) => (
                                        <label key={course} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleFilterChange('courses', course)}
                                                className="h-4 w-4 text-nss-500 border-gray-300 rounded focus:ring-nss-500"
                                            />
                                            <span className="text-sm text-gray-700">{course}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Semesters Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Semesters</h4>
                                <div className="space-y-2">
                                    {Object.entries(filters.semesters).map(([semester, checked]) => (
                                        <label key={semester} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleFilterChange('semesters', semester)}
                                                className="h-4 w-4 text-nss-500 border-gray-300 rounded focus:ring-nss-500"
                                            />
                                            <span className="text-sm text-gray-700">Semester {semester}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
                                <div className="space-y-2">
                                    {Object.entries(filters.status).map(([status, checked]) => (
                                        <label key={status} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleFilterChange('status', status)}
                                                className="h-4 w-4 text-nss-500 border-gray-300 rounded focus:ring-nss-500"
                                            />
                                            <span className="text-sm text-gray-700">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Clear All
                            </button>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 text-sm font-medium text-white bg-nss-500 rounded-lg hover:bg-nss-600 transition-colors flex items-center space-x-2"
                                >
                                    <Check className="h-4 w-4" />
                                    <span>Apply Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
