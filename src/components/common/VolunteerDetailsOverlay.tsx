import React, { useEffect, useState } from 'react';
import { X, User, Phone, MapPin, GraduationCap, Heart, Users, Globe, UserCheck, UserX, Clock } from 'lucide-react';
import { VolunteerProfile } from '@/types/VolunteerProfile';
import { FilledButton, OutlinedButton } from '../ui';
import { unitVolunteerService } from '@/services/unitVolunteerService';

interface VolunteerDetailsOverlayProps {
    volunteer: VolunteerProfile | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate?: () => void; // Callback to refresh volunteer list
    userRole?: 'admin' | 'unit'; // Control which actions are available
    onCertifyVolunteer?: (volunteer: VolunteerProfile) => void; // Admin-only action
    isCertifying?: boolean; // Loading state for certification
    onUncertifyVolunteer?: (volunteer: VolunteerProfile) => void; // Admin-only undo action
    isUncertifying?: boolean; // Loading state for uncertification
}

export const VolunteerDetailsOverlay: React.FC<VolunteerDetailsOverlayProps> = ({
    volunteer,
    isOpen,
    onClose,
    onStatusUpdate,
    userRole = 'unit', // Default to unit for backward compatibility
    onCertifyVolunteer,
    isCertifying = false,
    onUncertifyVolunteer,
    isUncertifying = false
}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [localVolunteer, setLocalVolunteer] = useState<VolunteerProfile | null>(volunteer);

    // Update local volunteer state when prop changes
    useEffect(() => {
        setLocalVolunteer(volunteer);
    }, [volunteer]);

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when overlay is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleStatusUpdate = async (newStatus: 'approved' | 'rejected' | 'pending') => {
        if (!localVolunteer?.id) return;

        setIsUpdating(true);
        setUpdateError(null);

        try {
            const updated = await unitVolunteerService.updateVolunteerStatus(
                localVolunteer.id,
                newStatus
            );
            setLocalVolunteer(updated);
            
            // Call parent callback to refresh the list
            if (onStatusUpdate) {
                onStatusUpdate();
            }
        } catch (err: any) {
            setUpdateError(err.message || 'Failed to update volunteer status');
            console.error('Error updating volunteer status:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !localVolunteer) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'certified':
                return 'bg-blue-100 text-blue-800 border-2 border-blue-300';
            case 'approved':
                return 'bg-tree-100 text-tree-800';
            case 'pending':
                return 'bg-nss-100 text-nss-800';
            case 'rejected':
                return 'bg-blood-100 text-blood-800';
            default:
                return 'bg-white text-black border border-gray-300';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-4">
                        {localVolunteer.photo_url ? (
                            <img
                                src={localVolunteer.photo_url}
                                alt={localVolunteer.full_name || 'Volunteer'}
                                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {localVolunteer.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'V'}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{localVolunteer.full_name}</h2>
                            <p className="text-gray-600">{localVolunteer.ktu_id}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(localVolunteer.status || 'pending')}`}>
                                {localVolunteer.status || 'pending'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-blue-500" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Gender:</span>
                                        <span className="font-medium capitalize">{localVolunteer.gender || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span className="font-medium">{localVolunteer.dob ? formatDate(localVolunteer.dob) : 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Blood Group:</span>
                                        <span className="font-medium flex items-center">
                                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                                            {localVolunteer.blood_group || 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Height:</span>
                                        <span className="font-medium">{localVolunteer.height ? `${localVolunteer.height} cm` : 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Weight:</span>
                                        <span className="font-medium">{localVolunteer.weight ? `${localVolunteer.weight} kg` : 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Religion:</span>
                                        <span className="font-medium capitalize">{localVolunteer.religion || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Community:</span>
                                        <span className="font-medium">{localVolunteer.community || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-green-500" />
                                    Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        {localVolunteer.contact_number ? (
                                            <a href={`tel:${localVolunteer.contact_number}`} className="font-medium text-blue-600 hover:text-blue-800">
                                                {localVolunteer.contact_number}
                                            </a>
                                        ) : (
                                            <span className="font-medium text-gray-400">Not specified</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">WhatsApp:</span>
                                        {localVolunteer.whatsapp_number ? (
                                            <a href={`https://wa.me/${localVolunteer.whatsapp_number.replace(/[^0-9]/g, '')}`} className="font-medium text-green-600 hover:text-green-800">
                                                {localVolunteer.whatsapp_number}
                                            </a>
                                        ) : (
                                            <span className="font-medium text-gray-400">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Globe className="h-5 w-5 mr-2 text-purple-500" />
                                    Languages Known
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {localVolunteer.languages_known && localVolunteer.languages_known.length > 0 ? (
                                        localVolunteer.languages_known.map((language, index) => (
                                            <span key={index} className="px-3 py-1 bg-nss-100 text-nss-800 rounded-full text-sm font-medium">
                                                {language}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Not specified</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Academic & Address Information */}
                        <div className="space-y-6">
                            {/* Academic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <GraduationCap className="h-5 w-5 mr-2 text-orange-500" />
                                    Academic Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Course:</span>
                                        <span className="font-medium">{localVolunteer.course || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Semester:</span>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                            {localVolunteer.semester ? `S${localVolunteer.semester}` : 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Admission Year:</span>
                                        <span className="font-medium font-mono">{localVolunteer.admission_year || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Unit:</span>
                                        <span className="font-medium">{localVolunteer.unit_number || 'Not assigned'}</span>
                                    </div>
                                    {localVolunteer.status === 'certified' && localVolunteer.enroll_no && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Enrollment Number:</span>
                                            <span className="font-medium font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded">{localVolunteer.enroll_no}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Registration Date:</span>
                                        <span className="font-medium">{localVolunteer.created_at ? formatDate(localVolunteer.created_at) : 'Not available'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                                    Address Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">District:</span>
                                        <span className="font-medium">{localVolunteer.district || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Taluk:</span>
                                        <span className="font-medium">{localVolunteer.taluk || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Village:</span>
                                        <span className="font-medium">{localVolunteer.village || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Pincode:</span>
                                        <span className="font-medium font-mono">{localVolunteer.pincode || 'Not specified'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 block mb-2">Permanent Address:</span>
                                        <p className="font-medium text-sm bg-gray-50 p-3 rounded-lg">
                                            {localVolunteer.permanent_address || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Parent/Guardian Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-indigo-500" />
                                    Parent/Guardian Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium">{localVolunteer.parent_name || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Contact:</span>
                                        {localVolunteer.parent_contact_number ? (
                                            <a href={`tel:${localVolunteer.parent_contact_number}`} className="font-medium text-blue-600 hover:text-blue-800">
                                                {localVolunteer.parent_contact_number}
                                            </a>
                                        ) : (
                                            <span className="font-medium text-gray-400">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Update Error */}
                    {updateError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{updateError}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Status Update Buttons - Only for Unit Coordinators */}
                            {userRole === 'unit' ? (
                                <div className="flex flex-wrap gap-3 flex-1">
                                    {localVolunteer.status === 'certified' ? (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg">
                                            <UserCheck className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">Certified by Admin - Cannot modify status</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FilledButton
                                                onClick={() => handleStatusUpdate('approved')}
                                                disabled={isUpdating || localVolunteer.status === 'approved'}
                                                isLoading={isUpdating}
                                                loadingText="Updating..."
                                                variant="primary"
                                                size="md"
                                                className="flex items-center gap-2 bg-tree-600 hover:bg-tree-700"
                                            >
                                                <UserCheck className="h-4 w-4" />
                                                <span>{localVolunteer.status === 'approved' ? 'Approved' : 'Approve'}</span>
                                            </FilledButton>

                                            <OutlinedButton
                                                onClick={() => handleStatusUpdate('rejected')}
                                                disabled={isUpdating || localVolunteer.status === 'rejected'}
                                                size="md"
                                                className="flex items-center gap-2 border-blood-300 text-blood-600 hover:border-blood-400 hover:bg-blood-50"
                                            >
                                                <UserX className="h-4 w-4" />
                                                <span>{localVolunteer.status === 'rejected' ? 'Rejected' : 'Reject'}</span>
                                            </OutlinedButton>

                                            {(localVolunteer.status === 'approved' || localVolunteer.status === 'rejected') && (
                                                <FilledButton
                                                    onClick={() => handleStatusUpdate('pending')}
                                                    disabled={isUpdating}
                                                    isLoading={isUpdating}
                                                    variant="lightNss"
                                                    size="md"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                    <span>Reset to Pending</span>
                                                </FilledButton>
                                        )}
                                    </>
                                )}
                            </div>
                            ) : (
                                // Admin view - only certify action for approved volunteers
                                <div className="flex flex-wrap gap-3 flex-1">
                                    {localVolunteer.status === 'certified' ? (
                                        <>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg">
                                                <UserCheck className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">Already Certified</span>
                                            </div>
                                            <OutlinedButton
                                                onClick={() => onUncertifyVolunteer?.(localVolunteer)}
                                                disabled={isUncertifying}
                                                size="md"
                                                className="flex items-center gap-2 border-nss-300 text-nss-600 hover:border-nss-400 hover:bg-nss-50"
                                            >
                                                <Clock className="h-4 w-4" />
                                                <span>{isUncertifying ? 'Reverting...' : 'Undo Certification'}</span>
                                            </OutlinedButton>
                                        </>
                                    ) : localVolunteer.status === 'approved' ? (
                                        <FilledButton
                                            onClick={() => onCertifyVolunteer?.(localVolunteer)}
                                            disabled={isCertifying}
                                            isLoading={isCertifying}
                                            loadingText="Certifying..."
                                            variant="primary"
                                            size="md"
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                        >
                                            <UserCheck className="h-4 w-4" />
                                            <span>Certify Volunteer</span>
                                        </FilledButton>
                                    ) : (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                            <span className="text-sm text-gray-600">
                                                {localVolunteer.status === 'pending' ? 'Pending approval from unit coordinator' : 
                                                 localVolunteer.status === 'rejected' ? 'Rejected by unit coordinator' : 
                                                 'Only approved volunteers can be certified'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Close Button */}
                            <OutlinedButton
                                onClick={onClose}
                                size="md"
                                className="border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                            >
                                Close
                            </OutlinedButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
