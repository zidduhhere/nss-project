import { useState } from 'react';
import { TreePine } from 'lucide-react';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { ImagePreviewFileUpload } from '@/components/common';

interface TreeTaggingSubmissionData {
    location: string;
    plantationDate: string;
    treesPlanted: string;
    treeSpecies: string;
    activityDetails: string;
}

interface TreeTaggingSubmissionProps {
    onSuccess?: () => void;
}

const TreeTaggingSubmission = ({ onSuccess }: TreeTaggingSubmissionProps = {}) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<TreeTaggingSubmissionData>({
        location: '',
        plantationDate: '',
        treesPlanted: '',
        treeSpecies: '',
        activityDetails: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (field: keyof TreeTaggingSubmissionData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.plantationDate) newErrors.plantationDate = 'Plantation date is required';
        if (!formData.treesPlanted.trim()) newErrors.treesPlanted = 'Number of trees planted is required';
        if (!formData.treeSpecies.trim()) newErrors.treeSpecies = 'Tree species is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (uploadedFiles.length === 0) {
            alert('Please upload photos of the planted trees with tags');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            alert('Tree tagging submission successful!');

            // Reset form
            setFormData({
                location: '',
                plantationDate: '',
                treesPlanted: '',
                treeSpecies: '',
                activityDetails: ''
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
                    <div className="bg-green-50 p-4 rounded-full">
                        <TreePine className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tree Tagging Submission</h2>
                <p className="text-gray-600">Submit your tree plantation photos for NSS points</p>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <TextField
                            label="Location *"
                            value={formData.location}
                            onChange={handleInputChange('location')}
                            placeholder="Enter plantation location"
                            error={errors.location}
                        />

                        {/* Plantation Date */}
                        <TextField
                            label="Date of Plantation *"
                            type="date"
                            value={formData.plantationDate}
                            onChange={handleInputChange('plantationDate')}
                            error={errors.plantationDate}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trees Planted */}
                        <TextField
                            label="Trees Planted *"
                            type="number"
                            min="1"
                            value={formData.treesPlanted}
                            onChange={handleInputChange('treesPlanted')}
                            placeholder="Enter number of trees planted"
                            error={errors.treesPlanted}
                        />

                        {/* Tree Species */}
                        <TextField
                            label="Tree Species *"
                            value={formData.treeSpecies}
                            onChange={handleInputChange('treeSpecies')}
                            placeholder="e.g., Neem, Mango, Banyan"
                            error={errors.treeSpecies}
                        />
                    </div>

                    {/* Activity Details */}
                    <TextArea
                        label="Activity Details (Optional)"
                        value={formData.activityDetails}
                        onChange={handleInputChange('activityDetails')}
                        placeholder="Describe the tree plantation activity and environmental impact..."
                        rows={4}
                    />

                    {/* File Upload */}
                    <ImagePreviewFileUpload
                        uploadedFiles={uploadedFiles}
                        onFilesChange={setUploadedFiles}
                        accept="image/*"
                        multiple={true}
                        label="Upload Photos *"
                        uploadText="Click to upload photos"
                        supportedFormats="JPG, JPEG, PNG"
                        maxSize="10MB"
                        uploadButtonColor="green"
                        id="file-upload-tree"
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                        disabled={uploadedFiles.length === 0}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold text-lg"
                    >
                        Submit Tree Tagging
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default TreeTaggingSubmission;
