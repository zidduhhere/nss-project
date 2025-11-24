import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard } from '../../../components/common';
import { Table, Footer } from '../../../components/ui';
import { FileText, Download, Eye, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';

interface Submission {
    id: string;
    studentName: string;
    studentId: string;
    submissionType: 'Blood Donation' | 'Tree Tagging';
    submittedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    fileName: string;
    description?: string;
}

const demoSubmissions: Submission[] = [
    {
        id: "1",
        studentName: "Arjun Krishnan",
        studentId: "KTU2021CSE001",
        submissionType: "Blood Donation",
        submittedDate: "2025-08-28",
        status: "Pending",
        fileName: "blood_donation_cert_001.pdf",
        description: "Blood donation camp at Thrissur General Hospital"
    },
    {
        id: "2",
        studentName: "Priya Nair",
        studentId: "KTU2021ECE015",
        submissionType: "Tree Tagging",
        submittedDate: "2025-08-27",
        status: "Approved",
        fileName: "tree_tagging_002.jpg",
        description: "Tree tagging activity in college premises"
    },
    {
        id: "3",
        studentName: "Rohit Menon",
        studentId: "KTU2020ME025",
        submissionType: "Blood Donation",
        submittedDate: "2025-08-26",
        status: "Rejected",
        fileName: "blood_cert_invalid.pdf",
        description: "Invalid certificate format"
    },
    {
        id: "4",
        studentName: "Anjali Pillai",
        studentId: "KTU2021IT008",
        submissionType: "Tree Tagging",
        submittedDate: "2025-08-25",
        status: "Approved",
        fileName: "tree_tag_004.jpg",
        description: "Community tree planting drive"
    },
    {
        id: "5",
        studentName: "Kiran Kumar",
        studentId: "KTU2022CSE012",
        submissionType: "Blood Donation",
        submittedDate: "2025-08-24",
        status: "Pending",
        fileName: "blood_donation_005.pdf",
        description: "Blood donation at Kerala Blood Bank"
    }
];

interface UnitSubmissionsProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitSubmissions({ }: UnitSubmissionsProps) {


    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'Rejected':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'Approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
        }
    };

    const submissionColumns = [
        {
            key: 'studentName' as keyof Submission,
            header: 'Student',
            width: '20%',
            render: (value: string, item: Submission) => (
                <div>
                    <div className="font-medium text-gray-900">{value}</div>
                    <div className="text-sm text-gray-500">{item.studentId}</div>
                </div>
            )
        },
        {
            key: 'submissionType' as keyof Submission,
            header: 'Type',
            width: '15%',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Blood Donation'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'fileName' as keyof Submission,
            header: 'File',
            width: '20%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{value}</span>
                </div>
            )
        },
        {
            key: 'submittedDate' as keyof Submission,
            header: 'Submitted',
            width: '12%',
            render: (value: string) => (
                <span className="text-sm text-gray-600">
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'status' as keyof Submission,
            header: 'Status',
            width: '12%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    {getStatusIcon(value)}
                    <span className={getStatusBadge(value)}>{value}</span>
                </div>
            )
        },
        {
            key: 'id' as keyof Submission,
            header: 'Actions',
            width: '21%',
            render: (value: string, item: Submission) => (
                <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                    </button>
                    {item.status === 'Pending' && (
                        <>
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                Approve
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                Reject
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    const stats = [
        {
            label: 'Total Submissions',
            value: demoSubmissions.length,
            icon: FileText,
            color: 'bg-nss-500'
        },
        {
            label: 'Pending Review',
            value: demoSubmissions.filter(s => s.status === 'Pending').length,
            icon: Clock,
            color: 'bg-nss-500'
        },
        {
            label: 'Approved',
            value: demoSubmissions.filter(s => s.status === 'Approved').length,
            icon: CheckCircle,
            color: 'bg-nss-500'
        },
        {
            label: 'Rejected',
            value: demoSubmissions.filter(s => s.status === 'Rejected').length,
            icon: XCircle,
            color: 'bg-nss-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
                {/* Header */}
                <div className="hidden lg:flex items-end justify-end gap-6">
                    {/* Unit Info Card */}
                    <UnitInfoCard className="w-full lg:w-80 flex-shrink-0" />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`h-10 w-10 sm:h-12 sm:w-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search submissions..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                                />
                            </div>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto">
                                <option value="">All Types</option>
                                <option value="blood">Blood Donation</option>
                                <option value="tree">Tree Tagging</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto">
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-none">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </button>
                            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none">
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Student Submissions</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Review and approve certificate submissions</p>
                    </div>
                    <Table data={demoSubmissions} columns={submissionColumns} />
                </div>
            </div>
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
}
