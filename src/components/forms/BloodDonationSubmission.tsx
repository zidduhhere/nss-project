import { Droplets } from 'lucide-react';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { ImagePreviewFileUpload } from '@/components/common';
import { Dropdown } from '../ui';
import { FieldError, useForm } from 'react-hook-form';
import { useState } from 'react';



interface BloodDonationFormValues {
    hospitalName: string;
    donationDate: Date;
    donationType: string;
    donationCase: string;
    certificate: File[] | null;
}



const BloodDonationSubmission = () => {

    const {register, handleSubmit, watch, formState: { errors, isLoading, isDirty }, getValues, setValue} = useForm<BloodDonationFormValues>({
        defaultValues: {
            hospitalName: '',
            donationDate: new Date(),
            donationType: '',
            donationCase: '',
            certificate: null
        }
    });

    const watchCertificate = watch('certificate');

    
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
                <form onSubmit={handleSubmit((data) => {
                    console.log('Form Data:', data);
                })} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hospital Name */}
                        <TextField
                            {...register('hospitalName', { required: 'Hospital Name is required', minLength: { value: 2, message: 'Hospital Name must be at least 3 characters' } })}
                        label="Hospital Name *"

                            placeholder="Enter hospital name"
                            error={errors.hospitalName}
                        />

                        {/* Date of Donation */}
                        <TextField
                            {...register('donationDate', { required: 'Date of Donation is required' })}
                            label="Date of Donation *"
                            type="date"
                            error={errors.donationDate}
                        />
                    </div>

                    {/* Type of Blood Donated */}
                    <Dropdown
                        {...register('donationType', { required: 'Type of Donation is required' })}
                        label='Type Of Donation *'
                        options={["Platelets", "Whole Blood", "Plasma", "Double Red Cells"]}
                        error={errors.donationType}

                        />

                    {/* Donation Case */}
                    <TextArea
                        {...register('donationCase')}
                        label="Donation Case (Optional)"
                       
                        placeholder="Describe the case or reason for donation (optional)"
                        rows={4}
                    />

                    {/* File Upload */}
                    <ImagePreviewFileUpload
                    {...register('certificate', {
                        required: 'Certificate is required',
                       
                        
                    })}
                        uploadedFiles={getValues('certificate') || []}
                        onFilesChange={(files) => {
                            setValue('certificate', files);
                        }}
                        accept="image/*,.pdf"
                        multiple={true}
                        label="Upload Certificate *"
                        uploadText="Click to upload certificate"
                        supportedFormats="PDF, JPG, JPEG, PNG"
                        maxSize="10MB"
                        uploadButtonColor="red"
                        id="file-upload"
                        error={errors.certificate as FieldError}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Submitting..."
                        disabled={!isDirty}
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
