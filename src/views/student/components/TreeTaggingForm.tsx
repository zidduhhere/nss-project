import { useState } from 'react';
import { TreePine, Upload, MapPin } from 'lucide-react';
import { CreateTreeTaggingRequest, TreeTaggingFormData } from '../../../models';
import { validateRequired } from '../../../utils';
import { ErrorMessage, LoadingSpinner } from '../../common';

interface TreeTaggingFormProps {
    onSubmit: (submission: CreateTreeTaggingRequest) => Promise<boolean>;
    studentName: string;
}

export default function TreeTaggingForm({ onSubmit, studentName }: TreeTaggingFormProps) {
    const [formData, setFormData] = useState<TreeTaggingFormData>({
        treeName: '',
        scientificName: '',
        location: '',
        treeImage: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        const treeNameValidation = validateRequired(formData.treeName, 'Tree name');
        if (!treeNameValidation.isValid) {
            errors.treeName = treeNameValidation.error!;
        }

        const scientificNameValidation = validateRequired(formData.scientificName, 'Scientific name');
        if (!scientificNameValidation.isValid) {
            errors.scientificName = scientificNameValidation.error!;
        }

        const locationValidation = validateRequired(formData.location, 'Location');
        if (!locationValidation.isValid) {
            errors.location = locationValidation.error!;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field: keyof TreeTaggingFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, treeImage: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const submissionData: CreateTreeTaggingRequest = {
                studentName,
                treeName: formData.treeName,
                scientificName: formData.scientificName,
                location: formData.location,
                treeImage: formData.treeImage
            };

            const success = await onSubmit(submissionData);

            if (success) {
                setSuccess(true);
                setFormData({
                    treeName: '',
                    scientificName: '',
                    location: '',
                    treeImage: null
                });

                // Hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError('Failed to submit tree tagging. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                    <TreePine className="h-6 w-6 text-green-500 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900">Tree Tagging Form</h3>
                </div>
            </div>

            <div className="p-6">
                {success && (
                    <div className="mb-6">
                        <ErrorMessage message="Tree tagging submitted successfully!" type="success" />
                    </div>
                )}

                {error && (
                    <div className="mb-6">
                        <ErrorMessage message={error} type="error" onClose={() => setError(null)} />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="treeName" className="block text-sm font-medium text-gray-700 mb-2">
                                <TreePine className="inline h-4 w-4 mr-1" />
                                Tree Name *
                            </label>
                            <input
                                type="text"
                                id="treeName"
                                value={formData.treeName}
                                onChange={(e) => handleChange('treeName', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.treeName ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter tree name"
                                disabled={isSubmitting}
                            />
                            {fieldErrors.treeName && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.treeName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-2">
                                Scientific Name *
                            </label>
                            <input
                                type="text"
                                id="scientificName"
                                value={formData.scientificName}
                                onChange={(e) => handleChange('scientificName', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.scientificName ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter scientific name"
                                disabled={isSubmitting}
                            />
                            {fieldErrors.scientificName && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.scientificName}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.location ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter tree location"
                            disabled={isSubmitting}
                        />
                        {fieldErrors.location && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="treeImage" className="block text-sm font-medium text-gray-700 mb-2">
                            <Upload className="inline h-4 w-4 mr-1" />
                            Tree Image
                        </label>
                        <input
                            type="file"
                            id="treeImage"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            accept=".jpg,.jpeg,.png"
                            disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Accepted formats: JPG, PNG (Max 5MB)
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <TreePine className="h-5 w-5 mr-2" />
                                    Submit Tree Tagging
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
