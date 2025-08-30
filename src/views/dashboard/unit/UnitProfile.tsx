import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard } from '../../../components/common';
import { useMasterAuth } from '../../../context/MasterAuthContext';
import { TextField, TextArea, Button } from '../../../components/ui';
import { User, Mail, Phone, MapPin, Calendar, Building, Users } from 'lucide-react';
import { useState } from 'react';

interface UnitProfileProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitProfile({ }: UnitProfileProps) {
    const { } = useMasterAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        unitName: "Computer Science Department",
        coordinatorName: "Dr. Rajesh Kumar",
        email: "cs.nss@college.edu.in",
        phone: "+91 9876543210",
        college: "Government Engineering College",
        address: "Thrissur, Kerala - 680009",
        establishedYear: "2018",
        totalVolunteers: "45",
        description: "The Computer Science NSS unit actively participates in community service activities including blood donation drives, environmental conservation, and digital literacy programs for rural communities."
    });

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to backend
        console.log('Profile saved:', profileData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original data if needed
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-6 flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Unit Profile</h2>
                                <p className="text-blue-100">Manage your NSS unit information and settings</p>
                            </div>
                            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Building className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Unit Info Card */}
                    <UnitInfoCard className="w-80 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Form */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Unit Information</h3>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    label="Unit Name"
                                    value={profileData.unitName}
                                    onChange={(e) => setProfileData({ ...profileData, unitName: e.target.value })}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Coordinator Name"
                                    value={profileData.coordinatorName}
                                    onChange={(e) => setProfileData({ ...profileData, coordinatorName: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Phone Number"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <TextField
                                label="College"
                                value={profileData.college}
                                onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                                disabled={!isEditing}
                            />

                            <TextField
                                label="Address"
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                disabled={!isEditing}
                            />

                            <TextArea
                                label="Unit Description"
                                value={profileData.description}
                                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                disabled={!isEditing}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Established</span>
                                    </div>
                                    <span className="font-medium">{profileData.establishedYear}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Total Volunteers</span>
                                    </div>
                                    <span className="font-medium">{profileData.totalVolunteers}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    Download Unit Report
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    Export Volunteer List
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    Activity Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
