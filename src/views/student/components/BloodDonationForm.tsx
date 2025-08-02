import { useState } from 'react';
import { Droplets, Upload, Calendar, Building2 } from 'lucide-react';
import { CreateBloodDonationRequest, BloodDonationFormData } from '../../../models';
import { validateRequired, validateNumber, isValidDate } from '../../../utils';
import { ErrorMessage, LoadingSpinner } from '../../common';

interface BloodDonationFormProps {
    onSubmit: (submission: CreateBloodDonationRequest) => Promise<boolean>;
}

export default function BloodDonationForm({ onSubmit }: BloodDonationFormProps) {
    const [formData, setFormData] = useState<BloodDonationFormData>({
        hospitalName: '',
        donationDate: '',
        unitsdonated: '',
        donationCase: '',
        certificate: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        const hospitalValidation = validateRequired(formData.hospitalName, 'Hospital name');
        if (!hospitalValidation.isValid) {
            errors.hospitalName = hospitalValidation.error!;
        }

        const dateValidation = validateRequired(formData.donationDate, 'Donation date');
        if (!dateValidation.isValid) {
            errors.donationDate = dateValidation.error!;
        } else if (!isValidDate(formData.donationDate)) {
            errors.donationDate = 'Please enter a valid date';
        }

        const unitsValidation = validateNumber(formData.unitsdonated, 'Units donated', 1, 10);
        if (!unitsValidation.isValid) {
            errors.unitsdonated = unitsValidation.error!;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field: keyof BloodDonationFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, certificate: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const submissionData: CreateBloodDonationRequest = {
                hospitalName: formData.hospitalName,
                donationDate: formData.donationDate,
                unitsdonated: parseInt(formData.unitsdonated),
                donationCase: formData.donationCase || undefined,
                certificate: formData.certificate
            };

            const success = await onSubmit(submissionData);

            if (success) {
                setSuccess(true);
                setFormData({
                    hospitalName: '',
                    donationDate: '',
                    unitsdonated: '',
                    donationCase: '',
                    certificate: null
                });

                // Hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError('Failed to submit blood donation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                    <Droplets className="h-6 w-6 text-red-500 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900">Blood Donation Form</h3>
                </div>
            </div>

            <div className="p-6">
                {success && (
                    <div className="mb-6">
                        <ErrorMessage message="Blood donation submitted successfully!" type="success" />
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
                            <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-2">
                                <Building2 className="inline h-4 w-4 mr-1" />
                                Hospital Name *
                            </label>
                            <input
                                type="text"
                                id="hospitalName"
                                value={formData.hospitalName}
                                onChange={(e) => handleChange('hospitalName', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${fieldErrors.hospitalName ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter hospital name"
                                disabled={isSubmitting}
                            />
                            {fieldErrors.hospitalName && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.hospitalName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="donationDate" className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Donation Date *
                            </label>
                            <input
                                type="date"
                                id="donationDate"
                                value={formData.donationDate}
                                onChange={(e) => handleChange('donationDate', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${fieldErrors.donationDate ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {fieldErrors.donationDate && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.donationDate}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="unitsdonated" className="block text-sm font-medium text-gray-700 mb-2">
                                Units Donated *
                            </label>
                            <input
                                type="number"
                                id="unitsdonated"
                                value={formData.unitsdonated}
                                onChange={(e) => handleChange('unitsdonated', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${fieldErrors.unitsdonated ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Number of units"
                                min="1"
                                max="10"
                                disabled={isSubmitting}
                            />
                            {fieldErrors.unitsdonated && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.unitsdonated}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="inline h-4 w-4 mr-1" />
                                Certificate
                            </label>
                            <input
                                type="file"
                                id="certificate"
                                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                accept=".pdf,.jpg,.jpeg,.png"
                                disabled={isSubmitting}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Accepted formats: PDF, JPG, PNG (Max 5MB)
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="donationCase" className="block text-sm font-medium text-gray-700 mb-2">
                            Donation Case (Optional)
                        </label>
                        <textarea
                            id="donationCase"
                            value={formData.donationCase}
                            onChange={(e) => handleChange('donationCase', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Describe the case or reason for donation"
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Droplets className="h-5 w-5 mr-2" />
                                    Submit Blood Donation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
