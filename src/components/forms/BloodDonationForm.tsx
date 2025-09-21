import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Calendar, MapPin, User } from 'lucide-react';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/ui/FileUpload';

interface BloodDonationData {
  donationDate: string;
  location: string;
  organizer: string;
  bloodGroup: string;
  donorId: string;
  additionalNotes: string;
}

export default function BloodDonationForm() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BloodDonationData>({
    donationDate: '',
    location: '',
    organizer: '',
    bloodGroup: '',
    donorId: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof BloodDonationData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.donationDate) newErrors.donationDate = 'Donation date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer name is required';
    if (!formData.bloodGroup.trim()) newErrors.bloodGroup = 'Blood group is required';

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

      // Redirect to main submission form with pre-filled data
      navigate('/dashboard/student/certificates', {
        state: {
          type: 'Blood Donation',
          prefill: {
            activityTitle: `Blood Donation - ${formData.organizer}`,
            activityDate: formData.donationDate,
            location: formData.location,
            organizer: formData.organizer,
            description: `Blood donation at ${formData.location}. Blood Group: ${formData.bloodGroup}${formData.donorId ? `, Donor ID: ${formData.donorId}` : ''}`,
            additionalDetails: formData.additionalNotes
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
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
          <Droplets className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blood Donation Certificate</h2>
          <p className="text-gray-600">Submit your blood donation certificate for NSS points</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donation Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <TextField
              label="Donation Date *"
              type="date"
              value={formData.donationDate}
              onChange={handleInputChange('donationDate')}
              error={errors.donationDate}
              className="flex-1"
            />
          </div>

          {/* Blood Group */}
          <div className="flex items-center space-x-3">
            <Droplets className="w-5 h-5 text-gray-400" />
            <TextField
              label="Blood Group *"
              value={formData.bloodGroup}
              onChange={handleInputChange('bloodGroup')}
              placeholder="e.g., O+, A-, B+, AB-"
              error={errors.bloodGroup}
              className="flex-1"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <TextField
            label="Donation Location *"
            value={formData.location}
            onChange={handleInputChange('location')}
            placeholder="e.g., College Auditorium, City Hospital"
            error={errors.location}
            className="flex-1"
          />
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <TextField
            label="Organizer *"
            value={formData.organizer}
            onChange={handleInputChange('organizer')}
            placeholder="e.g., Red Cross Society, Blood Bank"
            error={errors.organizer}
            className="flex-1"
          />
        </div>

        {/* Donor ID */}
        <TextField
          label="Donor ID (Optional)"
          value={formData.donorId}
          onChange={handleInputChange('donorId')}
          placeholder="If provided on certificate"
        />

        {/* Additional Notes */}
        <TextArea
          label="Additional Notes (Optional)"
          value={formData.additionalNotes}
          onChange={handleInputChange('additionalNotes')}
          placeholder="Any additional information about the donation..."
          rows={3}
        />

        {/* File Upload */}
        <FileUpload
          label="Upload Certificate *"
          onFilesChange={handleFilesChange}
          acceptedTypes="image/*,.pdf"
          maxFileSize={5}
          maxFiles={3}
          multiple={true}
          requirements={[
            'Blood donation certificate (required)',
            'Photo from the donation event (optional)',
            'Receipt or acknowledgment (optional)'
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
          Submit Blood Donation Certificate
        </Button>
      </form>
    </div>
  );
}