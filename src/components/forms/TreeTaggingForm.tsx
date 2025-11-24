import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TreePine, Calendar, MapPin, Users, Hash } from 'lucide-react';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/ui/FileUpload';

interface TreePlantationData {
  plantationDate: string;
  location: string;
  organizer: string;
  treeSpecies: string;
  treesPlanted: number;
  tagNumber: string;
  environmentalImpact: string;
}

export default function TreeTaggingForm() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TreePlantationData>({
    plantationDate: '',
    location: '',
    organizer: '',
    treeSpecies: '',
    treesPlanted: 1,
    tagNumber: '',
    environmentalImpact: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof TreePlantationData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === 'treesPlanted' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.plantationDate) newErrors.plantationDate = 'Plantation date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer name is required';
    if (!formData.treeSpecies.trim()) newErrors.treeSpecies = 'Tree species is required';
    if (formData.treesPlanted < 1) newErrors.treesPlanted = 'Number of trees must be at least 1';

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

      // Redirect to main submission form with pre-filled data
      navigate('/dashboard/student/certificates', {
        state: {
          type: 'Tree Plantation',
          prefill: {
            activityTitle: `Tree Plantation - ${formData.treeSpecies}`,
            activityDate: formData.plantationDate,
            location: formData.location,
            organizer: formData.organizer,
            description: `Planted ${formData.treesPlanted} ${formData.treeSpecies} tree(s) at ${formData.location}${formData.tagNumber ? ` with tag number: ${formData.tagNumber}` : ''}`,
            additionalDetails: formData.environmentalImpact
          }
        }
      });

    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4">
          <TreePine className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tree Plantation Certificate</h2>
          <p className="text-gray-600">Submit photos of your tree plantation activity for NSS points</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plantation Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <TextField
              label="Plantation Date *"
              type="date"
              value={formData.plantationDate}
              onChange={handleInputChange('plantationDate')}
              error={errors.plantationDate}
              className="flex-1"
            />
          </div>

          {/* Tree Species */}
          <div className="flex items-center space-x-3">
            <TreePine className="w-5 h-5 text-gray-400" />
            <TextField
              label="Tree Species *"
              value={formData.treeSpecies}
              onChange={handleInputChange('treeSpecies')}
              placeholder="e.g., Neem, Mango, Banyan"
              error={errors.treeSpecies}
              className="flex-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Number of Trees */}
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <TextField
              label="Number of Trees Planted *"
              type="number"
              min="1"
              value={formData.treesPlanted.toString()}
              onChange={handleInputChange('treesPlanted')}
              error={errors.treesPlanted}
              className="flex-1"
            />
          </div>

          {/* Tag Number */}
          <div className="flex items-center space-x-3">
            <Hash className="w-5 h-5 text-gray-400" />
            <TextField
              label="Tag Number (Optional)"
              value={formData.tagNumber}
              onChange={handleInputChange('tagNumber')}
              placeholder="Tree identification tag"
              className="flex-1"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <TextField
            label="Plantation Location *"
            value={formData.location}
            onChange={handleInputChange('location')}
            placeholder="e.g., College Campus, Public Park, Highway"
            error={errors.location}
            className="flex-1"
          />
        </div>

        {/* Organizer */}
        <TextField
          label="Organizer/Event *"
          value={formData.organizer}
          onChange={handleInputChange('organizer')}
          placeholder="e.g., Earth Day Initiative, Forest Department"
          error={errors.organizer}
        />

        {/* Environmental Impact */}
        <TextArea
          label="Environmental Impact (Optional)"
          value={formData.environmentalImpact}
          onChange={handleInputChange('environmentalImpact')}
          placeholder="Describe the environmental benefits of this plantation..."
          rows={3}
        />

        {/* File Upload */}
        <FileUpload
          label="Upload Photos *"
          onFilesChange={handleFilesChange}
          acceptedTypes="image/*"
          maxFileSize={5}
          maxFiles={5}
          multiple={true}
          requirements={[
            'Photo of planted tree with tag (required)',
            'Photo of you with the planted tree (required)',
            'Group photo during plantation (optional)',
            'Before/after photos of the location (optional)'
          ]}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          disabled={uploadedFiles.length === 0}
          className="w-full"
        >
          Submit Tree Plantation Photos
        </Button>
      </form>
    </div>
  );
}