import { useState } from 'react';
import { Droplets } from 'lucide-react';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { ImagePreviewFileUpload } from '@/components/common';

interface BloodDonationSubmissionData {
    hospitalName: string;
    donationDate: string;
    unitsDonated: string;
    donationCase: string;
}

interface BloodDonationSubmissionProps {
    onSuccess?: () => void;
}

const BloodDonationSubmission = ({ onSuccess }: BloodDonationSubmissionProps = {}) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<BloodDonationSubmissionData>({
        hospitalName: '',
        donationDate: '',
        unitsDonated: '',
        donationCase: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (field: keyof BloodDonationSubmissionData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
        if (!formData.donationDate) newErrors.donationDate = 'Date of donation is required';
        if (!formData.unitsDonated.trim()) newErrors.unitsDonated = 'Units donated is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (uploadedFiles.length === 0) {
            alert('Please upload your blood donation certificate');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            alert('Blood donation submission successful!');

            // Reset form
            setFormData({
                hospitalName: '',
                donationDate: '',
                unitsDonated: '',
                donationCase: ''
            });
            setUploadedFiles([]);

            // Call onSuccess callback if provided
            if (onSuccess) {
                setTimeout(() => onSuccess(), 1000);
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header with Icon */}
            <div className="text-center px-8 pt-8 pb-6">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-50 p-4 rounded-full">
                        <Droplets className="w-8 h-8 text-red-500" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Blood Donation Submission</h2>
                <p className="text-gray-600">Submit your blood donation details for NSS points</p>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hospital Name */}
                        <TextField
                            label="Hospital Name *"
                            value={formData.hospitalName}
                            onChange={handleInputChange('hospitalName')}
                            placeholder="Enter hospital name"
                            error={errors.hospitalName}
                        />

                        {/* Date of Donation */}
                        <TextField
                            label="Date of Donation *"
                            type="date"
                            value={formData.donationDate}
                            onChange={handleInputChange('donationDate')}
                            error={errors.donationDate}
                        />
                    </div>

                    {/* Units Donated */}
                    <TextField
                        label="Units Donated *"
                        value={formData.unitsDonated}
                        onChange={handleInputChange('unitsDonated')}
                        placeholder="Enter number of units donated"
                        error={errors.unitsDonated}
                    />

                    {/* Donation Case */}
                    <TextArea
                        label="Donation Case (Optional)"
                        value={formData.donationCase}
                        onChange={handleInputChange('donationCase')}
                        placeholder="Describe the case or reason for donation (optional)"
                        rows={4}
                    />

                    {/* File Upload */}
                    <ImagePreviewFileUpload
                        uploadedFiles={uploadedFiles}
                        onFilesChange={setUploadedFiles}
                        accept="image/*,.pdf"
                        multiple={true}
                        label="Upload Certificate *"
                        uploadText="Click to upload certificate"
                        supportedFormats="PDF, JPG, JPEG, PNG"
                        maxSize="10MB"
                        uploadButtonColor="red"
                        id="file-upload"
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                        disabled={uploadedFiles.length === 0}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold text-lg"
                    >
                        Submit Blood Donation
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default BloodDonationSubmission;
