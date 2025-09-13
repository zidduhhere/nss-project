import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { Table } from '../../../components/ui';
import { useMasterAuth } from '../../../context/MasterAuthContext';
import { demoStudents, Student } from '@/assets/utils/students';
import { Users, Mail, Phone, GraduationCap, Calendar, BookOpen } from 'lucide-react';

interface UnitDashboardProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitDashboard({ }: UnitDashboardProps) {
    const { } = useMasterAuth();

    const studentColumns = [
        {
            key: 'name' as keyof Student,
            header: 'Name',
            width: '20%',
            render: (value: string) => (
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
            header: 'Phone Number',
            width: '15%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value}</span>
                </div>
            )
        },
        {
            key: 'ktuId' as keyof Student,
            header: 'KTU ID',
            width: '15%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
                </div>
            )
        },
        {
            key: 'semester' as keyof Student,
            header: 'Semester',
            width: '10%',
            render: (value: number) => (
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Sem {value}
                    </span>
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
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-6">
                {/* Header */}




                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{demoStudents.length}</p>
                            </div>
                            <div className="h-12 w-12 bg-nss-500 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                                <p className="text-2xl font-bold text-gray-900">5</p>
                            </div>
                            <div className="h-12 w-12 bg-nss-500 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg Semester</p>
                                <p className="text-2xl font-bold text-gray-900">5.9</p>
                            </div>
                            <div className="h-12 w-12 bg-nss-500 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Student Directory</h3>
                        <p className="text-sm text-gray-600 mt-1">Manage and view all registered NSS students</p>
                    </div>
                    <Table data={demoStudents} columns={studentColumns} />
                </div>
            </div>
        </div>
    );
}
