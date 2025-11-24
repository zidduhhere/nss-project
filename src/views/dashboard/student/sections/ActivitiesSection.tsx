import { Calendar, MapPin, User, Users, Camera, ExternalLink } from 'lucide-react';
import { Placeholder } from '@/components/common';

interface Activity {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    studentsParticipated: number;
    images: string[];
    date: string;
    location: string;
    organizer: string;
}

interface ActivitiesSectionProps {
    activities: Activity[];
}

function ActivityCard({ activity }: { activity: Activity }) {
    return (
        <div className="bg-white rounded-xl shadow-sm  hover:shadow-md transition-shadow">
            <div className="md:flex">
                <div className="md:w-1/3">
                    <Placeholder
                        height="h-48 md:h-full"
                        variant="generic"
                        label={activity.title}
                        rounded="rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                        className="w-full"
                    />
                </div>
                <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                            <p className="text-sm text-gray-600">{activity.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            <Users className="h-3 w-3" />
                            <span>{activity.studentsParticipated}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{activity.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{activity.organizer}</span>
                        </div>
                    </div>

                    {activity.images.length > 1 && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                            <Camera className="h-3 w-3" />
                            <span>+{activity.images.length - 1} more photos</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ActivitiesSection = ({ activities }: ActivitiesSectionProps) => {
    return (
        <section className="mb-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-7xl font-thin text-gray-900">College Activities</h2>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                    <ExternalLink className="h-4 w-4" />
                </button>
            </div>
            <div className="space-y-6">
                {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                ))}
            </div>
        </section>
    );
};

export default ActivitiesSection;