import { Droplets } from "lucide-react";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { ImagePreviewFileUpload } from "@/components/common";
import { Dropdown } from "../ui";
import { FieldError, useForm } from "react-hook-form";
import { useState } from "react";
import { activitySubmissionService } from "@/services/activitySubmissionService";
import { UseAuthContext } from "@/context/AuthContext";
import SuccessModal from "@/components/common/SuccessModal";
import { Alert, AlertDescription } from "@/components/shadcn/alert";

interface BloodDonationFormValues {
  hospitalName: string;
  donationDate: string;
  donationType: string;
  donationCase: string;
  certificate: File[] | null;
}

interface BloodDonationSubmissionProps {
  onSuccess?: () => void;
}

const BloodDonationSubmission = ({ onSuccess }: BloodDonationSubmissionProps) => {
  const { session } = UseAuthContext();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<BloodDonationFormValues>({
    defaultValues: {
      hospitalName: "",
      donationDate: "",
      donationType: "",
      donationCase: "",
      certificate: null,
    },
  });

  const watchCertificate = watch("certificate");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: BloodDonationFormValues) => {
    if (!session?.user?.id) {
      setSubmitError("You must be logged in to submit.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await activitySubmissionService.submitBloodDonation(
        {
          hospitalName: data.hospitalName,
          donationDate: data.donationDate,
          typeDonated: data.donationType,
          donationCase: data.donationCase,
          certificate: data.certificate?.[0] || null,
        },
        session.user.id
      );

      setShowSuccess(true);
      reset();
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "Failed to submit blood donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title="Submission Successful!"
        message="Your blood donation has been submitted for review. You'll be notified once it's approved."
        onClose={() => setShowSuccess(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
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
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              {...register("hospitalName", {
                required: "Hospital Name is required",
                minLength: { value: 2, message: "Hospital Name must be at least 2 characters" },
              })}
              label="Hospital Name *"
              placeholder="Enter hospital name"
              error={errors.hospitalName}
            />

            <TextField
              {...register("donationDate", { required: "Date of Donation is required" })}
              label="Date of Donation *"
              type="date"
              error={errors.donationDate}
            />
          </div>

          <Dropdown
            {...register("donationType", { required: "Type of Donation is required" })}
            label="Type Of Donation *"
            options={["Platelets", "Whole Blood", "Plasma", "Double Red Cells"]}
            error={errors.donationType}
          />

          <TextArea
            {...register("donationCase")}
            label="Donation Case (Optional)"
            placeholder="Describe the case or reason for donation (optional)"
            rows={4}
          />

          <ImagePreviewFileUpload
            uploadedFiles={watchCertificate || []}
            onFilesChange={(files) => {
              setValue("certificate", files, { shouldValidate: true, shouldDirty: true });
            }}
            accept="image/*,.pdf"
            multiple={false}
            label="Upload Certificate *"
            uploadText="Click to upload certificate"
            supportedFormats="PDF, JPG, JPEG, PNG"
            maxSize="10MB"
            uploadButtonColor="red"
            id="file-upload"
            error={errors.certificate as FieldError}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Submitting..."
            disabled={!isDirty || isSubmitting}
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
