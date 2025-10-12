import React, { useEffect } from 'react';
import { X, User, Phone, MapPin, GraduationCap, Heart, Users, Globe } from 'lucide-react';
import { Volunteer } from '@/assets/utils/volunteers';

interface VolunteerDetailsOverlayProps {
    volunteer: Volunteer | null;
    isOpen: boolean;
    onClose: () => void;
}

export const VolunteerDetailsOverlay: React.FC<VolunteerDetailsOverlayProps> = ({
    volunteer,
    isOpen,
    onClose
}) => {
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

    if (!isOpen || !volunteer) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'New':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                        {volunteer.photo ? (
                            <img
                                src={volunteer.photo}
                                alt={volunteer.name}
                                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {volunteer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{volunteer.name}</h2>
                            <p className="text-gray-600">{volunteer.ktuId}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(volunteer.status)}`}>
                                {volunteer.status}
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
                                        <span className="font-medium">{volunteer.gender}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span className="font-medium">{formatDate(volunteer.dob)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Blood Group:</span>
                                        <span className="font-medium flex items-center">
                                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                                            {volunteer.bloodGroup || 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Height:</span>
                                        <span className="font-medium">{volunteer.height} cm</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Weight:</span>
                                        <span className="font-medium">{volunteer.weight} kg</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Religion:</span>
                                        <span className="font-medium">{volunteer.religion}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Community:</span>
                                        <span className="font-medium">{volunteer.community}</span>
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
                                        <a href={`tel:${volunteer.contactNumber}`} className="font-medium text-blue-600 hover:text-blue-800">
                                            {volunteer.contactNumber}
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">WhatsApp:</span>
                                        <a href={`https://wa.me/${volunteer.whatsappNumber.replace(/[^0-9]/g, '')}`} className="font-medium text-green-600 hover:text-green-800">
                                            {volunteer.whatsappNumber}
                                        </a>
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
                                    {volunteer.languagesKnown.map((language, index) => (
                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                            {language}
                                        </span>
                                    ))}
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
                                        <span className="font-medium">{volunteer.course}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Semester:</span>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                            {volunteer.semster}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Admission Year:</span>
                                        <span className="font-medium font-mono">{volunteer.admissionYear}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Unit:</span>
                                        <span className="font-medium">{volunteer.unit}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Registration Date:</span>
                                        <span className="font-medium">{formatDate(volunteer.registrationDate)}</span>
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
                                        <span className="font-medium">{volunteer.district}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Taluk:</span>
                                        <span className="font-medium">{volunteer.taluk}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Village:</span>
                                        <span className="font-medium">{volunteer.village}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Pincode:</span>
                                        <span className="font-medium font-mono">{volunteer.pincode}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 block mb-2">Permanent Address:</span>
                                        <p className="font-medium text-sm bg-gray-50 p-3 rounded-lg">
                                            {volunteer.permanentAddress}
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
                                        <span className="font-medium">{volunteer.parent}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Contact:</span>
                                        <a href={`tel:${volunteer.parentContact}`} className="font-medium text-blue-600 hover:text-blue-800">
                                            {volunteer.parentContact}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Edit Volunteer
                            </button>
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>Contact</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};