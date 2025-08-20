import React, { useState } from 'react';
import { TreePine, Upload, MapPin, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TreeTaggingForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    treeName: '',
    scientificName: '',
    location: '',
    treeImage: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { submitTreeTagging, user } = useApp();

  React.useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        studentName: user.name
      }));
    }
  }, [user]);

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
      treeImage: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      submitTreeTagging({
        studentName: formData.studentName,
        treeName: formData.treeName,
        scientificName: formData.scientificName,
        location: formData.location,
        treeImage: formData.treeImage
      });

      setSuccess(true);
      setFormData({
        studentName: user?.name || '',
        treeName: '',
        scientificName: '',
        location: '',
        treeImage: null
      });

      // Reset file input
      const fileInput = document.getElementById('treeImage') as HTMLInputElement;
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
          <TreePine className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Submission Successful!</h3>
        <p className="text-gray-600">Your tree tagging details have been submitted for review.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <TreePine className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Tree Tagging Submission</h3>
        <p className="text-gray-600 mt-2">Submit your tree tagging details for NSS points</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="treeName" className="block text-sm font-medium text-gray-700 mb-2">
              Tree Name
            </label>
            <input
              type="text"
              id="treeName"
              name="treeName"
              value={formData.treeName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter common tree name"
            />
          </div>

          <div>
            <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-2">
              Scientific Name
            </label>
            <input
              type="text"
              id="scientificName"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter scientific name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Describe the exact location where the tree is tagged"
            />
          </div>
        </div>

        <div>
          <label htmlFor="treeImage" className="block text-sm font-medium text-gray-700 mb-2">
            Tree Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <label htmlFor="treeImage" className="cursor-pointer">
                <span className="text-green-600 font-medium hover:text-green-700">
                  Click to upload tree image
                </span>
                <input
                  type="file"
                  id="treeImage"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500">JPG, JPEG, PNG up to 10MB</p>
              {formData.treeImage && (
                <p className="text-sm text-green-600 font-medium">
                  Selected: {formData.treeImage.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Tree Tagging'}
        </button>
      </form>
    </div>
  );
}