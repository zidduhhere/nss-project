import { VolunteerProfile } from '@/types/VolunteerProfile';
import { BookOpen, Calendar, MapPin, Phone } from 'lucide-react';

export function getVolunteerColumns(
    handleViewVolunteer: (volunteer: VolunteerProfile) => void
) {
    return [
        {
            key: 'full_name' as keyof VolunteerProfile,
            header: 'Name',
            width: '18%',
            render: (value: string | null, volunteer: VolunteerProfile) => (
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        <img src={volunteer.photo_url ?? ""} alt={`${value}'s profile`} className="h-8 w-8 rounded-full" />
                    </div>
                    <div>
                        <span className="font-medium text-gray-900">{value || 'N/A'}</span>
                        <div className="text-xs text-gray-500">{volunteer.ktu_id || 'N/A'}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'contact_number' as keyof VolunteerProfile,
            header: 'Contact',
            width: '15%',
            render: (value: string | null) => (
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'course' as keyof VolunteerProfile,
            header: 'Course',
            width: '18%',
            render: (value: string | null) => (
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{value || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'semester' as keyof VolunteerProfile,
            header: 'Semester',
            width: '10%',
            render: (value: number | null) => (
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                        {value ? `${value}` : 'N/A'}
                    </span>
                </div>
            )
        },
        {
            key: 'district' as keyof VolunteerProfile,
            header: 'District',
            width: '12%',
            render: (value: string | null) => (
                <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'status' as keyof VolunteerProfile,
            header: 'Status',
            width: '10%',
            render: (value: string | null) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    value?.toLowerCase() === 'certified' ? 'bg-blue-100 text-blue-800' :
                    value?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                    value?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    value?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {value || 'N/A'}
                </span>
            )
        },
        {
            key: 'admission_year' as keyof VolunteerProfile,
            header: 'Batch',
            width: '8%',
            render: (value: number | null) => (
                <span className="text-gray-600 font-mono text-sm">{value || 'N/A'}</span>
            )
        },
        {
            key: 'id' as keyof VolunteerProfile,
            header: 'Actions',
            width: '9%',
            render: (_: string, volunteer: VolunteerProfile) => (
                <div className="flex space-x-1">
                    <button
                        onClick={() => handleViewVolunteer(volunteer)}
                        className="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded border border-primary-200 hover:bg-primary-50"
                    >
                        View
                    </button>
                </div>
            )
        }
    ];
}
