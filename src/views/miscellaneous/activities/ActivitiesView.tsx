import { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { activitiesService, Activity } from '@/services/activitiesService';
import { Calendar, MapPin, Users, Clock, CalendarCheck, Filter } from 'lucide-react';
import dayjs from 'dayjs';

const activityTypeLabels: Record<Activity['activity_type'], string> = {
    camp: 'Camp',
    blood_donation: 'Blood Donation',
    tree_planting: 'Tree Planting',
    workshop: 'Workshop',
    awareness: 'Awareness',
    other: 'Other',
};

const activityTypeColors: Record<Activity['activity_type'], string> = {
    camp: 'bg-blue-100 text-blue-700',
    blood_donation: 'bg-blood-100 text-blood-700',
    tree_planting: 'bg-tree-100 text-tree-700',
    workshop: 'bg-purple-100 text-purple-700',
    awareness: 'bg-amber-100 text-amber-700',
    other: 'bg-secondary-100 text-secondary-700',
};

const statusColors: Record<Activity['status'], string> = {
    upcoming: 'bg-blue-500',
    ongoing: 'bg-green-500',
    completed: 'bg-secondary-400',
    cancelled: 'bg-red-400',
};

type TabFilter = 'all' | 'upcoming' | 'completed';

export default function ActivitiesView() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const data = await activitiesService.getAllActivities();
                setActivities(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load activities');
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const filteredActivities = activities.filter((activity) => {
        if (activeTab === 'upcoming') return activity.status === 'upcoming' || activity.status === 'ongoing';
        if (activeTab === 'completed') return activity.status === 'completed';
        return true;
    });

    const tabs: { label: string; value: TabFilter }[] = [
        { label: 'All Activities', value: 'all' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Completed', value: 'completed' },
    ];

    return (
        <div className="min-h-screen bg-white font-isans">
            <Navbar />
            <main className="pt-32 max-w-6xl mx-auto px-6 pb-24">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-nss-50 border border-nss-200/50 text-nss-700 rounded-full text-sm font-semibold mb-4">
                        <CalendarCheck className="w-4 h-4" />
                        <span>NSS Activities</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">Activities</h1>
                    <p className="text-secondary-600 leading-relaxed max-w-2xl text-lg">
                        Explore upcoming and past NSS activities including camps, workshops, blood donation drives, and tree planting events.
                    </p>
                </div>

                {/* Tab Filter */}
                <div className="flex flex-wrap gap-2 mb-10 border-b border-secondary-200 pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                activeTab === tab.value
                                    ? 'bg-nss-600 text-white shadow-md'
                                    : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-2xl border border-secondary-100 p-6">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-secondary-100 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-secondary-100 rounded w-1/4" />
                                        <div className="h-6 bg-secondary-100 rounded w-1/2" />
                                        <div className="h-4 bg-secondary-100 rounded w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-16">
                        <p className="text-secondary-500 text-lg">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredActivities.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nss-50 flex items-center justify-center">
                            <Filter className="w-10 h-10 text-nss-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                            {activeTab === 'upcoming' ? 'No upcoming activities' : activeTab === 'completed' ? 'No completed activities' : 'No activities yet'}
                        </h3>
                        <p className="text-secondary-500 max-w-md mx-auto">
                            {activeTab === 'upcoming'
                                ? 'New activities will be posted here when they are announced.'
                                : 'Upcoming and past NSS activities will be listed here. Check back soon!'}
                        </p>
                    </div>
                )}

                {/* Activity List */}
                {!loading && !error && filteredActivities.length > 0 && (
                    <div className="space-y-4">
                        {filteredActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="group rounded-2xl border border-secondary-100 bg-white hover:shadow-lg hover:border-nss-200/50 transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Date Sidebar */}
                                    <div className="md:w-28 flex-shrink-0 bg-gradient-to-br from-nss-50 to-nss-100/50 flex flex-col items-center justify-center p-4 md:p-6">
                                        <span className="text-3xl font-bold text-nss-700">
                                            {dayjs(activity.start_date).format('DD')}
                                        </span>
                                        <span className="text-sm font-semibold text-nss-500 uppercase">
                                            {dayjs(activity.start_date).format('MMM')}
                                        </span>
                                        <span className="text-xs text-nss-400">
                                            {dayjs(activity.start_date).format('YYYY')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 md:p-6">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            {/* Status Dot */}
                                            <span className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${statusColors[activity.status]}`} />
                                                <span className="text-xs font-medium text-secondary-500 capitalize">
                                                    {activity.status}
                                                </span>
                                            </span>
                                            {/* Type Badge */}
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${activityTypeColors[activity.activity_type]}`}>
                                                {activityTypeLabels[activity.activity_type]}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-nss-700 transition-colors">
                                            {activity.title}
                                        </h3>

                                        <p className="text-secondary-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                            {activity.description}
                                        </p>

                                        {/* Meta Row */}
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-400">
                                            {activity.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {activity.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {dayjs(activity.start_date).format('h:mm A')}
                                                {activity.end_date && ` - ${dayjs(activity.end_date).format('MMM D, h:mm A')}`}
                                            </span>
                                            {activity.organizer && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {activity.organizer}
                                                </span>
                                            )}
                                            {activity.max_participants && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Max {activity.max_participants} participants
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
