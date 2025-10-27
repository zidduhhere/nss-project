import { Dropdown, FilledButton, TextField } from '@/components/ui'
import { DashboardHeader } from './sections'
import { unitListForDropDown } from '@/utils/data/collegeUnits'
import { useForm } from 'react-hook-form';
import { getAllDistricts, getTaluksByDistrict, getVillagesByTaluk } from '@/utils/data/taluks';
import { languages, VolunteerFormFields, VolunteerSchema } from '@/types/VolunteerFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePreviewFileUpload, LoadingSpinner } from '@/components/common';
import { bloodGroups, communities, religions } from '@/utils/data/community';
import { useVolunteerRegistration } from '@/hooks/useVolunteerRegistration';
import { useState } from 'react';

const VolunteerRegistrationPage = () => {

    const currentYear: string = new Date().getFullYear().toString();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm<VolunteerFormFields>({
        resolver: zodResolver(VolunteerSchema),
    });

    const { registerVolunteer, isLoading, error, success, resetState } = useVolunteerRegistration();

    // Watch district and taluk values from React Hook Form state
    const watchDistrict = watch("district");
    const watchTaluk = watch("taluk");
    const watchPhoto = watch("photo");
    const watchSignature = watch("signature");


    const onSubmit = async (data: VolunteerFormFields) => {
        try {
            console.log("Submitting form data:", data);
            await registerVolunteer(data);
            setShowSuccessModal(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                reset();
                setShowSuccessModal(false);
                resetState();
            }, 3000);
        } catch (err) {
            console.error("Registration failed:", err);
            // Error is handled by the hook
        }
    }

    const onError = (errors: any) => {
        console.log("Form validation failed!");
        console.log("Errors:", errors);
    }

    return (
        <div className='min-h-screen bg-gray-100 '>
            <DashboardHeader />

            {/* Loading Overlay */}
            {(isSubmitting || isLoading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                        <LoadingSpinner size='lg' message='Submitting your registration...' />
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
                        <p className="text-gray-600">Your volunteer registration has been submitted successfully.</p>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="fixed top-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={resetState}
                            className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* {Main Content} */}
            <div className='max-w-full px-8 py-12 flex justify-center items-center'>

                <div className='mt-16'>
                    <h2 className='text-4xl font-isans font-semibold text-primary-500'>Volunteer Registration</h2>
                    <p className='mt-2 text-md text-gray-600'>Please fill in all the required details below.</p>

                    <div className='bg-white lg:bg-transparent rounded-2xl p-8 mt-8 w-full max-w-[70rem] md:max-w-full shadow-sm border border-gray-100'>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>

                            {/* Institution Details Section */}
                            <div className='mb-12'>
                                <h3 className='text-2xl font-semibold text-primary-500 mb-6'>Institution Details</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                    <Dropdown
                                        {...register("unit")}
                                        label='Select College Unit'
                                        required
                                        placeholder='Select your college unit'
                                        options={unitListForDropDown}

                                        error={errors.unit}
                                    />
                                    <Dropdown
                                        {...register("semster")}
                                        required
                                        label='Enrollment Semester'
                                        placeholder='Select your semester'
                                        error={errors.semster}
                                        options={['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']}
                                    />
                                    <TextField
                                        {...register("course")}
                                        required
                                        label='Course'
                                        placeholder='Enter your course'
                                        error={errors.course}
                                    />
                                    <TextField
                                        {...register("admissionYear", { valueAsNumber: true })}
                                        required
                                        type='number'
                                        label='Admission Year'
                                        placeholder={`e.g. ${currentYear}`}
                                        error={errors.admissionYear as any}
                                    />
                                    <TextField
                                        {...register("ktuId")}
                                        required
                                        label='KTU ID'
                                        placeholder='Enter your KTU ID'
                                        error={errors.ktuId}
                                    />
                                </div>
                            </div>

                            {/* Personal Details Section */}
                            <div className='mb-12'>
                                <h3 className='text-2xl font-semibold text-primary-500 mb-6'>Personal Details</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                    <TextField
                                        {...register("name")}
                                        required
                                        label='Full Name'
                                        placeholder='Enter your full name'
                                        error={errors.name}
                                    />
                                    <Dropdown
                                        {...register("gender")}
                                        required
                                        error={errors.gender}
                                        label='Gender'
                                        placeholder='Select your gender'
                                        options={['Male', 'Female']}
                                    />
                                    <TextField
                                        {...register("dob")}
                                        required
                                        type="date"
                                        error={errors.dob}
                                        label='Date of Birth'
                                        placeholder='Select your date of birth'
                                    />
                                    <TextField
                                        {...register("contactNumber")}
                                        required
                                        type='tel'
                                        label='Contact Number'
                                        placeholder='Enter your contact number'
                                        error={errors.contactNumber}
                                    />
                                    <TextField
                                        {...register("whatsappNumber")}
                                        required
                                        type='tel'
                                        label='WhatsApp Number'
                                        placeholder='Enter your WhatsApp number'
                                        error={errors.whatsappNumber}
                                    />
                                    <Dropdown
                                        {...register("religion")}
                                        required
                                        error={errors.religion}
                                        label='Religion'
                                        placeholder='Select your religion'
                                        options={religions}
                                    />
                                    <Dropdown
                                        {...register("community")}
                                        error={errors.community}
                                        required
                                        label='Community'
                                        placeholder='Select your community'
                                        options={communities}
                                    />
                                    <Dropdown
                                        {...register("bloodGroup")}
                                        error={errors.bloodGroup}
                                        required
                                        label='Blood Group'
                                        placeholder='Select your blood group'
                                        options={bloodGroups}
                                    />
                                    <TextField
                                        {...register("height")}
                                        required
                                        type='number'
                                        label='Height (cm)'
                                        placeholder='Enter your height'
                                        error={errors.height}
                                    />
                                    <TextField
                                        {...register("weight")}
                                        required
                                        type='number'
                                        label='Weight (kg)'
                                        placeholder='Enter your weight'
                                        error={errors.weight}
                                    />
                                </div>
                            </div>

                            {/* Address Details Section */}
                            <div className='mb-12'>
                                <h3 className='text-2xl font-semibold text-primary-500 mb-6'>Address Details</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {/* District - Reset dependent fields on change */}
                                    <Dropdown
                                        {...register("district")}
                                        onChange={(e) => {
                                            setValue('district', e.target.value);
                                            setValue('taluk', '');
                                            setValue('village', '');
                                        }}
                                        required
                                        error={errors.district}
                                        label='District'
                                        placeholder='Select your district'
                                        options={getAllDistricts()}
                                    />

                                    {/* Taluk - Options depend on watchDistrict */}
                                    <Dropdown
                                        {...register("taluk")}
                                        onChange={(e) => {
                                            setValue('taluk', e.target.value);
                                            setValue('village', '');
                                        }}
                                        required
                                        error={errors.taluk}
                                        label='Taluk'
                                        placeholder='Select your taluk'
                                        options={watchDistrict ? getTaluksByDistrict(watchDistrict) : []}
                                        disabled={!watchDistrict}
                                    />

                                    {/* Village - Options depend on watchDistrict and watchTaluk */}
                                    <Dropdown
                                        {...register("village")}
                                        required
                                        error={errors.village}
                                        label='Village'
                                        placeholder='Select your village'
                                        options={watchDistrict && watchTaluk ? getVillagesByTaluk(watchDistrict, watchTaluk) : []}
                                        disabled={!watchTaluk}
                                    />


                                </div>
                                <div className='mt-6 max-w-7xl grid grid-cols-1 md:grid-cols-2  gap-6'>
                                    <TextField
                                        {...register("pincode")}
                                        required
                                        type='text'
                                        label='Pincode'
                                        placeholder='Enter your pincode'
                                        error={errors.pincode}
                                    />
                                    <TextField
                                        {...register("permanentAddress")}
                                        required
                                        type='textarea'
                                        label='Permanent Address'
                                        placeholder='Enter your permanent address'
                                        error={errors.permanentAddress}
                                    />
                                </div>
                            </div>

                            {/* Parent/Guardian Details Section */}
                            <div className='mb-12'>
                                <h3 className='text-2xl font-semibold text-primary-500 mb-6'>Parent/Guardian Details</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <TextField
                                        {...register("parent")}
                                        required
                                        label="Parent/Guardian Name"
                                        placeholder="Enter parent/guardian name"
                                        error={errors.parent}
                                    />
                                    <TextField
                                        {...register("parentContact")}
                                        required
                                        type='tel'
                                        label="Parent/Guardian Contact"
                                        placeholder="Enter parent/guardian contact"
                                        error={errors.parentContact}
                                    />
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className='mb-12'>
                                <h3 className='text-2xl font-semibold text-primary-500 mb-6'>Documents</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <ImagePreviewFileUpload
                                        id='photo-upload'
                                        label='Photo'
                                        uploadText='Upload a recent passport size photograph'
                                        maxSize='2MB'
                                        uploadedFiles={watchPhoto ? [watchPhoto] : []}
                                        onFilesChange={(files) => {
                                            if (files.length > 0) {
                                                setValue('photo', files[0]);
                                            } else {
                                                setValue('photo', undefined as any);
                                            }
                                        }}
                                        supportedFormats='JPEG, PNG'
                                        multiple={false}
                                        accept="image/jpeg,image/png,image/jpg"
                                        error={errors.photo as any}
                                    />
                                    <ImagePreviewFileUpload
                                        id='signature-upload'
                                        label='Signature'
                                        uploadText='Upload your signature on white paper'
                                        maxSize='2MB'
                                        uploadedFiles={watchSignature ? [watchSignature] : []}
                                        onFilesChange={(files) => {
                                            if (files.length > 0) {
                                                setValue('signature', files[0]);
                                            } else {
                                                setValue('signature', undefined as any);
                                            }
                                        }}
                                        supportedFormats='JPEG, PNG'
                                        multiple={false}
                                        accept="image/jpeg,image/png,image/jpg"
                                        error={errors.signature as any}
                                    />
                                </div>
                            </div>

                            {/* Languages Known Section */}
                            <div className='mb-12'>
                                <h3 className='text-2xl font-semibold text-primary-500 mb-6'>Languages Known</h3>
                                <div className='flex flex-col space-y-4'>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        {
                                            languages.map((lang) => (
                                                <div key={lang} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        value={lang}
                                                        {...register("languagesKnown")}
                                                        className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                    />
                                                    <span className="text-gray-700">{lang}</span>
                                                </div>
                                            ))
                                        }
                                    </label>
                                </div>
                                {errors.languagesKnown && (
                                    <div className="mt-2 text-sm bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                                        <span>{errors.languagesKnown.message}</span>
                                    </div>
                                )}
                            </div>

                            <FilledButton
                                type='submit'
                                variant='primary'
                                size='lg'
                                className='w-full !mt-12 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3'>
                                Submit Registration
                            </FilledButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VolunteerRegistrationPage
{/* {Institution Details Form} */ }
