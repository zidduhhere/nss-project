import React, { useState } from 'react';
import { Droplets, Upload, Calendar, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BloodDonationForm() {
  const [formData, setFormData] = useState({
    hospitalName: '',
    donationDate: '',
    unitsdonated: '',
    donationCase: '',
    certificate: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { submitBloodDonation } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      certificate: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      submitBloodDonation({
        hospitalName: formData.hospitalName,
        donationDate: formData.donationDate,
        unitsdonated: parseInt(formData.unitsdonated),
        donationCase: formData.donationCase || undefined,
        certificate: formData.certificate
      });

      setSuccess(true);
      setFormData({
        hospitalName: '',
        donationDate: '',
        unitsdonated: '',
        donationCase: '',
        certificate: null
      });

      // Reset file input
      const fileInput = document.getElementById('certificate') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Droplets className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Submission Successful!</h3>
        <p className="text-gray-600">Your blood donation details have been submitted for review.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Droplets className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Blood Donation Submission</h3>
        <p className="text-gray-600 mt-2">Submit your blood donation details for NSS points</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-2">
              Hospital Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter hospital name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="donationDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Donation *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="donationDate"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="unitsdonated" className="block text-sm font-medium text-gray-700 mb-2">
            Units Donated *
          </label>
          <input
            type="number"
            id="unitsdonated"
            name="unitsdonated"
            value={formData.unitsdonated}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Enter number of units donated"
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="donationCase" className="block text-sm font-medium text-gray-700 mb-2">
            Donation Case (Optional)
          </label>
          <textarea
            id="donationCase"
            name="donationCase"
            value={formData.donationCase}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Describe the case or reason for donation (optional)"
          />
        </div>

        <div>
          <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Certificate *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <label htmlFor="certificate" className="cursor-pointer">
                <span className="text-red-600 font-medium hover:text-red-700">
                  Click to upload certificate
                </span>
                <input
                  type="file"
                  id="certificate"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  required
                />
              </label>
              <p className="text-sm text-gray-500">PDF, JPG, JPEG, PNG up to 10MB</p>
              {formData.certificate && (
                <p className="text-sm text-green-600 font-medium">
                  Selected: {formData.certificate.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Blood Donation'}
        </button>
      </form>
    </div>
  );
}