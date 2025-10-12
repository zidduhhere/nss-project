import { Volunteer } from '@/assets/utils/volunteers';
import { BookOpen, Calendar, MapPin, Phone } from 'lucide-react';




export function getVolunteerColumns(handleViewVolunteer: (volunteer: Volunteer) => void) {
    return [
        {
            key: 'name' as keyof Volunteer,
            header: 'Name',
            width: '18%',
            render: (value: string, volunteer: Volunteer) => (
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {value.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <span className="font-medium text-gray-900">{value}</span>
                        <div className="text-xs text-gray-500">{volunteer.ktuId}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'contactNumber' as keyof Volunteer,
            header: 'Contact',
            width: '15%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value}</span>
                </div>
            )
        },
        {
            key: 'course' as keyof Volunteer,
            header: 'Course',
            width: '18%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{value}</span>
                </div>
            )
        },
        {
            key: 'semster' as keyof Volunteer,
            header: 'Semester',
            width: '10%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'district' as keyof Volunteer,
            header: 'District',
            width: '12%',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{value}</span>
                </div>
            )
        },
        {
            key: 'status' as keyof Volunteer,
            header: 'Status',
            width: '10%',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Active' ? 'bg-green-100 text-green-800' :
                    value === 'New' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'admissionYear' as keyof Volunteer,
            header: 'Batch',
            width: '8%',
            render: (value: number) => (
                <span className="text-gray-600 font-mono text-sm">{value}</span>
            )
        },
        {
            key: 'id' as keyof Volunteer,
            header: 'Actions',
            width: '9%',
            render: (_: string, volunteer: Volunteer) => (
                <div className="flex space-x-1">
                    <button
                        onClick={() => handleViewVolunteer(volunteer)}
                        className="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded border border-primary-200 hover:bg-primary-50">
                        View
                    </button>
                </div>
            )
        }
    ];
}
