import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { Calendar, Users, MapPin, Clock, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Activity {
    id: string;
    title: string;
    type: 'Blood Donation' | 'Tree Tagging' | 'Community Service' | 'Awareness Program';
    date: string;
    time: string;
    location: string;
    description: string;
    maxParticipants: number;
    registeredParticipants: number;
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    organizer: string;
}

const demoActivities: Activity[] = [
    {
        id: "1",
        title: "Blood Donation Camp",
        type: "Blood Donation",
        date: "2025-09-05",
        time: "09:00 AM",
        location: "College Auditorium",
        description: "Annual blood donation camp in collaboration with Kerala Blood Bank",
        maxParticipants: 100,
        registeredParticipants: 75,
        status: "Upcoming",
        organizer: "Dr. Rajesh Kumar"
    },
    {
        id: "2",
        title: "Tree Plantation Drive",
        type: "Tree Tagging",
        date: "2025-09-10",
        time: "07:00 AM",
        location: "College Campus",
        description: "Campus tree plantation and tagging initiative for environmental conservation",
        maxParticipants: 50,
        registeredParticipants: 45,
        status: "Upcoming",
        organizer: "Prof. Meera Nair"
    },
    {
        id: "3",
        title: "Digital Literacy Program",
        type: "Community Service",
        date: "2025-08-25",
        time: "02:00 PM",
        location: "Nearby Village School",
        description: "Teaching basic computer skills to rural students",
        maxParticipants: 20,
        registeredParticipants: 18,
        status: "Completed",
        organizer: "Arjun Krishnan"
    },
    {
        id: "4",
        title: "Health Awareness Workshop",
        type: "Awareness Program",
        date: "2025-08-30",
        time: "10:00 AM",
        location: "Community Hall",
        description: "Awareness program on hygiene and preventive healthcare",
        maxParticipants: 80,
        registeredParticipants: 65,
        status: "Ongoing",
        organizer: "Dr. Priya Menon"
    }
];

interface UnitActivityProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitActivity({ }: UnitActivityProps) {

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'Upcoming':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'Ongoing':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Completed':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            case 'Cancelled':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Blood Donation':
                return 'border-l-red-500 bg-red-50';
            case 'Tree Tagging':
                return 'border-l-green-500 bg-green-50';
            case 'Community Service':
                return 'border-l-blue-500 bg-blue-50';
            case 'Awareness Program':
                return 'border-l-purple-500 bg-purple-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };

    const stats = [
        {
            label: 'Total Activities',
            value: demoActivities.length,
            icon: Calendar,
            color: 'bg-nss-500'
        },
        {
            label: 'Upcoming Events',
            value: demoActivities.filter(a => a.status === 'Upcoming').length,
            icon: Clock,
            color: 'bg-nss-500'
        },
        {
            label: 'Total Participants',
            value: demoActivities.reduce((sum, a) => sum + a.registeredParticipants, 0),
            icon: Users,
            color: 'bg-nss-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-6">
                {/* Header */}



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

                {/* Activities List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Scheduled Activities</h3>
                        <p className="text-sm text-gray-600 mt-1">Manage upcoming and past NSS activities</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {demoActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className={`border-l-4 ${getTypeColor(activity.type)} p-4 rounded-r-lg shadow-sm`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                                            <span className={getStatusBadge(activity.status)}>{activity.status}</span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                {activity.type}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-3">{activity.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span>{activity.time}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span>{activity.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span>{activity.registeredParticipants}/{activity.maxParticipants} participants</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-sm text-gray-500">
                                            Organizer: {activity.organizer}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Registration Progress</span>
                                        <span>{Math.round((activity.registeredParticipants / activity.maxParticipants) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-nss-500 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${(activity.registeredParticipants / activity.maxParticipants) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
