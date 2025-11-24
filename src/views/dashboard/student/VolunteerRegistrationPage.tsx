import { Dropdown, FilledButton, TextField, Footer } from "@/components/ui";
import { DashboardHeader } from "./sections";
import { unitListForDropDown } from "@/utils/data/collegeUnits";
import { useForm } from "react-hook-form";
import {
    getAllDistricts,
    getTaluksByDistrict,
    getVillagesByTaluk,
} from "@/utils/data/taluks";
import {
    languages,
    VolunteerFormFields,
    VolunteerSchema,
} from "@/types/VolunteerFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePreviewFileUpload, LoadingSpinner } from "@/components/common";
import { bloodGroups, communities, religions } from "@/utils/data/community";
import { useVolunteerRegistration } from "@/hooks/useVolunteerRegistration";
import { logVolunteerData, mockVolunteerDataSets } from "@/utils/mockData/volunteerMockData";
import { useState, useEffect } from "react";
import ErrorPop from "@/components/common/ErrorPop";
import SuccessModal from "@/components/common/SuccessModal";

const VolunteerRegistrationPage = () => {
    const currentYear: string = new Date().getFullYear().toString();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<VolunteerFormFields>({
        resolver: zodResolver(VolunteerSchema),
    });



    const { registerVolunteer, isLoading, error, resetState, getCollegeCourses } =
        useVolunteerRegistration();

    const [collegeCourses, setCollegeCourses] = useState<any[]>([]);

    // Fetch college courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            const courses = await getCollegeCourses();
            setCollegeCourses(courses);
        };
        fetchCourses();
    }, []);

    // Watch district and taluk values from React Hook Form state
    const watchDistrict = watch("district");
    const watchTaluk = watch("taluk");
    const watchPhoto = watch("photo");
    const watchSignature = watch("signature");

    // 🔧 DEBUGGING: Fill form with mock data
    const fillMockData = () => {
        // Choose which mock data to use:
        // const mockData = generateMockVolunteerData(); // Random data
        const mockData = mockVolunteerDataSets.complete; // Predefined complete data
        // const mockData = mockVolunteerDataSets.female; // Female student
        // const mockData = mockVolunteerDataSets.minimal; // Minimal data

        console.log('🔧 Filling form with mock data...');
        logVolunteerData(mockData);

        // Fill all form fields
        Object.keys(mockData).forEach((key) => {
            setValue(key as keyof VolunteerFormFields, mockData[key as keyof VolunteerFormFields]);
        });

        console.log('✅ Mock data loaded into form');
    };

    const onSubmit = async (data: VolunteerFormFields) => {
        try {
            logVolunteerData(data);
            await registerVolunteer(data);
            setShowSuccessModal(true);
            // Reset form after 3 seconds
            setTimeout(() => {
                reset();
                setShowSuccessModal(false);
            }, 3000);
        } catch (err) {
            // Error handling is done in the hook
        }
    }; //function end

    const onError = (errors: any) => {
        console.group("❌ Form Validation Failed");
        console.log("Errors:", errors);
        Object.keys(errors).forEach((key) => {
            console.log(`  - ${key}:`, errors[key].message);
        });
        console.groupEnd();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardHeader />

            {/* Loading Overlay */}
            {(isSubmitting || isLoading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                        <LoadingSpinner
                            size="lg"
                            message="Submitting your registration..."
                        />
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    title="Registration Successful"
                    message="Your volunteer registration has been submitted successfully."
                />
            )}

            {/* Error Alert */}

            {error && <ErrorPop error={error} onCloseClick={resetState} />}

            {/* {Main Content} */}
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex justify-center items-center">
                <div className="mt-12 sm:mt-16">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-isans font-semibold text-primary-500">
                                Volunteer Registration
                            </h2>
                            <p className="mt-2 text-sm sm:text-md text-gray-600">
                                Please fill in all the required details below.
                            </p>
                        </div>

                        {/* 🔧 DEBUG BUTTON - Remove in production */}
                        {process.env.NODE_ENV === 'development' && (
                            <button
                                type="button"
                                onClick={fillMockData}
                                className="px-3 sm:px-4 py-2 bg-nss-500 hover:bg-nss-600 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                            >
                                🔧 Fill Mock Data
                            </button>
                        )}
                    </div>

                    <div className="bg-white lg:bg-transparent rounded-2xl p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8 w-full max-w-[70rem] md:max-w-full shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            {/* Institution Details Section */}
                            <div className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-semibold text-primary-500 mb-4 sm:mb-6">
                                    Institution Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    <Dropdown
                                        {...register("unit")}
                                        label="Select College Unit"
                                        required
                                        placeholder="Select your college unit"
                                        options={unitListForDropDown}
                                        error={errors.unit}
                                    />
                                    <Dropdown
                                        {...register("semester")}
                                        required
                                        label="Enrollment Semester"
                                        placeholder="Select your semester"
                                        error={errors.semester}
                                        options={["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"]}
                                    />
                                    <Dropdown
                                        {...register("course")}
                                        required
                                        label="Course"
                                        placeholder="Select your course"
                                        options={collegeCourses}
                                        error={errors.course}
                                    />
                                    <TextField
                                        {...register("admissionYear", { valueAsNumber: true })}
                                        required
                                        type="number"
                                        label="Admission Year"
                                        placeholder={`e.g. ${currentYear}`}
                                        error={errors.admissionYear as any}
                                    />
                                    <TextField
                                        {...register("ktuId")}
                                        required
                                        label="KTU ID"
                                        placeholder="Enter your KTU ID"
                                        error={errors.ktuId}
                                    />
                                </div>
                            </div>

                            {/* Personal Details Section */}
                            <div className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-semibold text-primary-500 mb-4 sm:mb-6">
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    <TextField
                                        {...register("name")}
                                        required
                                        label="Full Name"
                                        placeholder="Enter your full name"
                                        error={errors.name}
                                    />
                                    <Dropdown
                                        {...register("gender")}
                                        required
                                        error={errors.gender}
                                        label="Gender"
                                        placeholder="Select your gender"
                                        options={["Male", "Female"]}
                                    />
                                    <TextField
                                        {...register("dob")}
                                        required
                                        type="date"
                                        error={errors.dob}
                                        label="Date of Birth"
                                        placeholder="Select your date of birth"
                                    />
                                    <TextField
                                        {...register("contactNumber")}
                                        required
                                        type="tel"
                                        label="Contact Number"
                                        placeholder="Enter your contact number"
                                        error={errors.contactNumber}
                                    />
                                    <TextField
                                        {...register("whatsappNumber")}
                                        required
                                        type="tel"
                                        label="WhatsApp Number"
                                        placeholder="Enter your WhatsApp number"
                                        error={errors.whatsappNumber}
                                    />
                                    <Dropdown
                                        {...register("religion")}
                                        required
                                        error={errors.religion}
                                        label="Religion"
                                        placeholder="Select your religion"
                                        options={religions}
                                    />
                                    <Dropdown
                                        {...register("community")}
                                        error={errors.community}
                                        required
                                        label="Community"
                                        placeholder="Select your community"
                                        options={communities}
                                    />
                                    <Dropdown
                                        {...register("bloodGroup")}
                                        error={errors.bloodGroup}
                                        required
                                        label="Blood Group"
                                        placeholder="Select your blood group"
                                        options={bloodGroups}
                                    />
                                    <TextField
                                        {...register("height")}
                                        required
                                        type="number"
                                        label="Height (cm)"
                                        placeholder="Enter your height"
                                        error={errors.height}
                                    />
                                    <TextField
                                        {...register("weight")}
                                        required
                                        type="number"
                                        label="Weight (kg)"
                                        placeholder="Enter your weight"
                                        error={errors.weight}
                                    />
                                </div>
                            </div>

                            {/* Address Details Section */}
                            <div className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-semibold text-primary-500 mb-4 sm:mb-6">
                                    Address Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {/* District - Reset dependent fields on change */}
                                    <Dropdown
                                        {...register("district")}
                                        onChange={(e) => {
                                            setValue("district", e.target.value);
                                            setValue("taluk", "");
                                            setValue("village", "");
                                        }}
                                        required
                                        error={errors.district}
                                        label="District"
                                        placeholder="Select your district"
                                        options={getAllDistricts()}
                                    />

                                    {/* Taluk - Options depend on watchDistrict */}
                                    <Dropdown
                                        {...register("taluk")}
                                        onChange={(e) => {
                                            setValue("taluk", e.target.value);
                                            setValue("village", "");
                                        }}
                                        required
                                        error={errors.taluk}
                                        label="Taluk"
                                        placeholder="Select your taluk"
                                        options={
                                            watchDistrict ? getTaluksByDistrict(watchDistrict) : []
                                        }
                                        disabled={!watchDistrict}
                                    />

                                    {/* Village - Options depend on watchDistrict and watchTaluk */}
                                    <Dropdown
                                        {...register("village")}
                                        required
                                        error={errors.village}
                                        label="Village"
                                        placeholder="Select your village"
                                        options={
                                            watchDistrict && watchTaluk
                                                ? getVillagesByTaluk(watchDistrict, watchTaluk)
                                                : []
                                        }
                                        disabled={!watchTaluk}
                                    />
                                </div>
                                <div className="mt-4 sm:mt-6 max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <TextField
                                        {...register("pincode")}
                                        required
                                        type="text"
                                        label="Pincode"
                                        placeholder="Enter your pincode"
                                        error={errors.pincode}
                                    />
                                    <TextField
                                        {...register("permanentAddress")}
                                        required
                                        type="textarea"
                                        label="Permanent Address"
                                        placeholder="Enter your permanent address"
                                        error={errors.permanentAddress}
                                    />
                                </div>
                            </div>

                            {/* Parent/Guardian Details Section */}
                            <div className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-semibold text-primary-500 mb-4 sm:mb-6">
                                    Parent/Guardian Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        type="tel"
                                        label="Parent/Guardian Contact"
                                        placeholder="Enter parent/guardian contact"
                                        error={errors.parentContact}
                                    />
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-semibold text-primary-500 mb-4 sm:mb-6">
                                    Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ImagePreviewFileUpload
                                        id="photo-upload"
                                        label="Photo"
                                        uploadText="Upload a recent passport size photograph"
                                        maxSize="2MB"
                                        uploadedFiles={watchPhoto ? [watchPhoto] : []}
                                        onFilesChange={(files) => {
                                            if (files.length > 0) {
                                                setValue("photo", files[0]);
                                            } else {
                                                setValue("photo", undefined as any);
                                            }
                                        }}
                                        supportedFormats="JPEG, PNG"
                                        multiple={false}
                                        accept="image/jpeg,image/png,image/jpg"
                                        error={errors.photo as any}
                                    />
                                    <ImagePreviewFileUpload
                                        id="signature-upload"
                                        label="Signature"
                                        uploadText="Upload your signature on white paper"
                                        maxSize="2MB"
                                        uploadedFiles={watchSignature ? [watchSignature] : []}
                                        onFilesChange={(files) => {
                                            if (files.length > 0) {
                                                setValue("signature", files[0]);
                                            } else {
                                                setValue("signature", undefined as any);
                                            }
                                        }}
                                        supportedFormats="JPEG, PNG"
                                        multiple={false}
                                        accept="image/jpeg,image/png,image/jpg"
                                        error={errors.signature as any}
                                    />
                                </div>
                            </div>

                            {/* Languages Known Section */}
                            <div className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-semibold text-primary-500 mb-4 sm:mb-6">
                                    Languages Known
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex flex-wrap items-center gap-4 sm:gap-6 cursor-pointer">
                                        {languages.map((lang) => (
                                            <div key={lang} className="flex items-center space-x-2 sm:space-x-3">
                                                <input
                                                    type="checkbox"
                                                    value={lang}
                                                    {...register("languagesKnown")}
                                                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                />
                                                <span className="text-gray-700">{lang}</span>
                                            </div>
                                        ))}
                                    </label>
                                </div>
                                {errors.languagesKnown && (
                                    <div className="mt-2 text-sm bg-blood-50 border border-blood-200 text-blood-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-blood-500 rounded-full flex-shrink-0"></div>
                                        <span>{errors.languagesKnown.message}</span>
                                    </div>
                                )}
                            </div>

                            <FilledButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full !mt-8 sm:!mt-12 bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-6 py-3 text-sm sm:text-base"
                            >
                                Submit Registration
                            </FilledButton>
                        </form>
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default VolunteerRegistrationPage;
