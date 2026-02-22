import { useState } from "react";
import { TreePine } from "lucide-react";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

interface TreeTaggingSubmissionData {
  location: string;
  plantationDate: string;
  treesPlanted: string;
  activityDetails: string;
  taggedTreeLinks: string[];
}

interface TreeTaggingSubmissionProps {
  onSuccess?: () => void;
}

const TreeTaggingSubmission = ({
  onSuccess,
}: TreeTaggingSubmissionProps = {}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TreeTaggingSubmissionData>({
    location: "",
    plantationDate: "",
    treesPlanted: "",
    taggedTreeLinks: [],
    activityDetails: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange =
    (field: keyof TreeTaggingSubmissionData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
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

    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.plantationDate)
      newErrors.plantationDate = "Plantation date is required";
    if (!formData.treesPlanted.trim())
      newErrors.treesPlanted = "Number of trees planted is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (uploadedFiles.length === 0) {
      alert("Please upload photos of the planted trees with tags");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      alert("Tree tagging submission successful!");

      // Reset form
      setFormData({
        location: "",
        plantationDate: "",
        treesPlanted: "",
        taggedTreeLinks: [],
        activityDetails: "",
      });
      setUploadedFiles([]);

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header with Icon */}
      <div className="text-center px-8 pt-8 pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-tree-50 p-4 rounded-full">
            <TreePine className="w-8 h-8 text-tree-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tree Tagging Submission
        </h2>
        <p className="text-gray-600">
          Submit your tree plantation photos for NSS points
        </p>
      </div>

      {/* Form */}
      <div className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <TextField
              label="Location *"
              value={formData.location}
              onChange={handleInputChange("location")}
              placeholder="Enter plantation location"
            />

            {/* Plantation Date */}
            <TextField
              label="Date of Plantation *"
              type="date"
              value={formData.plantationDate}
              onChange={handleInputChange("plantationDate")}
            />
          </div>

          {/* Trees Planted */}
          <TextField
            label="Trees Planted *"
            type="number"
            min="1"
            value={formData.treesPlanted}
            onChange={(e) => {
              const count = parseInt(e.target.value) || 0;
              setFormData((prev) => ({
                ...prev,
                treesPlanted: e.target.value,
                taggedTreeLinks: Array(count)
                  .fill("")
                  .map((_, i) => prev.taggedTreeLinks[i] || ""),
              }));
              // Clear error when user starts typing
              if (errors.treesPlanted) {
                const newErrors = { ...errors };
                delete newErrors.treesPlanted;
                setErrors(newErrors);
              }
            }}
            placeholder="Enter number of trees planted"
          />

          {/* Tagged Tree Links - Dynamic based on number of trees */}
          {formData.treesPlanted && parseInt(formData.treesPlanted) > 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagged Tree Links ({formData.taggedTreeLinks.length} of{" "}
                {formData.treesPlanted})
              </label>
              {formData.taggedTreeLinks.map((link, index) => (
                <TextField
                  key={index}
                  label={`Tree ${index + 1} Link`}
                  value={link}
                  onChange={(e) => {
                    const newLinks = [...formData.taggedTreeLinks];
                    newLinks[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      taggedTreeLinks: newLinks,
                    }));
                  }}
                  placeholder={`Enter link for tree ${index + 1}`}
                  className="border border-gray-300 rounded-xl p-4"
                />
              ))}
            </div>
          )}

          {/* Activity Details */}
          <TextArea
            label="Activity Details (Optional)"
            value={formData.activityDetails}
            onChange={handleInputChange("activityDetails")}
            placeholder="Describe the tree plantation activity and environmental impact..."
            className="border border-gray-300 rounded-xl p-4"
            rows={4}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Submitting..."
            className="w-full bg-tree-500 hover:bg-tree-600 text-white py-4 rounded-xl font-semibold text-lg"
          >
            Submit Tree Tagging
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TreeTaggingSubmission;
