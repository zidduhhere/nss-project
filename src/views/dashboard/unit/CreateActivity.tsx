import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  ImagePlus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import { TextField, FilledButton, Footer } from '@/components/ui';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ErrorMessage from '@/components/common/ErrorMessage';
import SuccessModal from '@/components/common/SuccessModal';
import { activitiesService, ActivityType } from '@/services/activitiesService';
import { UseAuthContext } from '@/context/AuthContext';
import { useUnitProfile } from '@/hooks/useUnitProfile';

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'camp', label: 'Camp' },
  { value: 'blood_donation', label: 'Blood Donation' },
  { value: 'tree_planting', label: 'Tree Planting' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'awareness', label: 'Awareness Program' },
  { value: 'other', label: 'Other' },
];

const MAX_IMAGES = 10;

export default function CreateActivity() {
  const navigate = useNavigate();
  const { session } = UseAuthContext();
  const unitId = session?.user?.id || '';
  const { profile } = useUnitProfile(unitId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('camp');
  const [customTypeName, setCustomTypeName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [studentsAttended, setStudentsAttended] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [report, setReport] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);

    setImages((prev) => [...prev, ...toAdd]);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) { setError('Activity title is required'); return; }
    if (!startDate) { setError('Start date is required'); return; }
    if (!profile) { setError('Unit profile not loaded'); return; }

    // Find the unit's nss_units.id (not the profile id)
    const unitNssId = profile.id;

    try {
      setIsSubmitting(true);
      await activitiesService.createActivity(
        unitNssId,
        {
          title: title.trim(),
          description: description.trim(),
          activity_type: activityType,
          custom_type_name: activityType === 'other' ? customTypeName.trim() : undefined,
          location: location.trim() || undefined,
          start_date: startDate,
          end_date: endDate || undefined,
          duration_hours: durationHours ? parseFloat(durationHours) : undefined,
          students_attended: studentsAttended ? parseInt(studentsAttended) : undefined,
          report: report || undefined,
          organizer: organizer.trim() || undefined,
        },
        images
      );

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/unit/activities');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-isans">
      <DashboardNavigation mode="unit" />

      {showSuccess && (
        <SuccessModal title="Activity Submitted" message="Your activity has been submitted for admin review." />
      )}

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/unit/activities')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Back to Activities
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Activity</h1>
          <p className="text-sm text-gray-500 mt-1">Submit a new activity report for admin review</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} type="error" onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Details</h3>
            <div className="space-y-4">
              <TextField
                label="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Blood Donation Camp at Town Hall"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Activity Type */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Activity Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-nss-500/20 focus:border-nss-500 transition-colors"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {activityType === 'other' && (
                  <TextField
                    label="Custom Type Name"
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    placeholder="Specify activity type"
                    required
                  />
                )}

                {activityType !== 'other' && (
                  <TextField
                    label="Organizer"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Who organized this?"
                  />
                )}
              </div>

              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the activity"
              />

              <TextField
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where did this activity take place?"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Duration (hours)"
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="e.g., 4.5"
                />
                <TextField
                  label="Students Attended"
                  type="number"
                  value={studentsAttended}
                  onChange={(e) => setStudentsAttended(e.target.value)}
                  placeholder="Number of students"
                />
              </div>

              {activityType === 'other' && (
                <TextField
                  label="Organizer"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Who organized this?"
                />
              )}
            </div>
          </div>

          {/* Report */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Report</h3>
            <RichTextEditor
              content={report}
              onChange={setReport}
              placeholder="Write a detailed report about the activity..."
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Images <span className="text-sm font-normal text-gray-400">({images.length}/{MAX_IMAGES})</span>
              </h3>
            </div>

            {/* Image Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <img src={preview} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-nss-300 hover:bg-nss-50/30 transition-colors"
              >
                <ImagePlus className="size-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/unit/activities')}
              className="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <FilledButton
              type="submit"
              variant="primary"
              size="lg"
              className="flex-[2]"
              isLoading={isSubmitting}
              loadingText="Submitting..."
              disabled={isSubmitting}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="size-4" />
                Submit Activity
              </div>
            </FilledButton>
          </div>
        </form>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
