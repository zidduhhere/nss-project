
import { Button, Dropdown, TextField } from '@/components/ui'
import { DashboardHeader } from './sections'
import { unitListForDropDown } from '@/utils/data/collegeUnits'
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PickerValue } from 'node_modules/@mui/x-date-pickers/esm/internals/models/value';
import { bloodGroups, communities, religions } from '@/utils/data/community';
import { getAllDistricts, getTaluksByDistrict, getVillagesByTaluk } from '@/utils/data/taluks';
import { VolunteerFormFields, VolunteerSchema } from '@/types/VolunteerFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePreviewFileUpload, LoadingSpinner } from '@/components/common';
import z from 'zod';
const VolunteerRegistrationPage = () => {

    const currentYear: string = new Date().getFullYear().toString();
    const [dob, setDob] = useState<PickerValue | undefined>(undefined);
    const [district, setDistrict] = useState<string | undefined>(undefined);
    const [taluk, setTaluk] = useState<string | undefined>(undefined);


    const { register, handleSubmit, setError, formState: { isSubmitting } } = useForm<VolunteerFormFields>({
        resolver: zodResolver(VolunteerSchema)
    });

    const onSubmit: SubmitHandler<VolunteerFormFields> = (data) => {
        try {

            throw new Error("Function not implemented.");
        }
        catch (error: any) {
            console.error(error);
            if (error instanceof z.ZodError) {
                error.issues.forEach((err) => {
                    if (err.path && err.path.length > 0) {
                        const fieldName = err.path[0] as keyof VolunteerFormFields;
                        setError(fieldName, { type: "manual", message: err.message });
                    }
                });
            } else {
                // Handle other types of errors if necessary
            }
        }
    }

    return (
        <div className='min-h-screen bg-gray-100 '>
            <DashboardHeader />
            {isSubmitting && (
                <div>
                    <LoadingSpinner size='lg' message='Submitting your registration...' />
                </div>
            )}


            {/* {Main Content} */}
            <div className='max-w-full px-8 py-12'>


                <div className='mt-16'>
                    <h2 className='text-4xl font-isans font-semibold text-primary-500'>Institution Details</h2>
                    <p className='mt-2 text-md  text-gray-600'>Please provide the details of your institution.</p>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        {/* {Institution Details Form} */}
                        <div
                            className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            <Dropdown
                                {...register("unit", {
                                    required: true
                                })}
                                label='Select College Unit'
                                required
                                placeholder='Select your college unit'
                                className='overflow-hidden'
                                options={unitListForDropDown}
                            />
                            <Dropdown
                                {...register("semster", {
                                    required: true
                                })}
                                required
                                label='Enrollement Semster'
                                placeholder='Select your semster'
                                options={['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']}
                            />
                            <TextField
                                {...register("course", {
                                    required: true
                                })}
                                required
                                label='Course'
                                placeholder='Enter your course'
                            />
                            <Dropdown
                                {...register("admissionYear", { valueAsNumber: true, required: true })}
                                label='Year Of Enrollement In NSS'
                                required
                                placeholder='Select year of enrollment'
                                options={[currentYear]}
                                className=''
                            />

                            <TextField
                                {...register("ktuId", {
                                    required: true
                                })}
                                required
                                label='KTU Registration Number'
                                placeholder='Enter your KTU Registration Number'
                            />

                        </div>

                        {/* {Personal Details} */}
                        <div className='mt-16'>
                            <h2 className='text-4xl font-isans font-semibold text-primary-500'>Personal Details</h2>
                            <p className='mt-2 text-md  text-gray-600'>Please provide your personal details.</p>


                            <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>

                                <TextField
                                    {...register("name", {
                                        required: true
                                    })}
                                    required
                                    label='Full Name' placeholder='Enter your full name' />
                                <Dropdown
                                    {...register("gender", {
                                        required: true
                                    })}
                                    required
                                    label='Gender' placeholder='Select your gender' options={['Male', 'Female']} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            {...register("dob", {
                                                required: true
                                            })}
                                            className='w-full rounded-lg border border-gray-100 bg-white'
                                            value={dob}

                                            onChange={(newValue) => setDob(newValue)}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <TextField
                                    {...register("contactNumber", {
                                        required: true
                                    })}
                                    type='tel'
                                    required
                                    label='Contact Number'
                                    placeholder='Enter your contact number' />
                                <TextField
                                    {...register("whatsappNumber", {
                                        required: true
                                    })}
                                    required
                                    label="WhatsApp Number"
                                    placeholder='Enter your WhatsApp number' />
                                <Dropdown
                                    {...register("religion", {
                                        required: true
                                    })}
                                    label='Religion'
                                    required
                                    placeholder='Select your religion'
                                    options={religions} />
                                <Dropdown
                                    {...register("community", {
                                        required: true
                                    })}
                                    label='Community'
                                    required
                                    placeholder='Select your community'
                                    options={communities} />
                                <Dropdown
                                    {...register("bloodGroup", {
                                        required: true
                                    })}
                                    required
                                    label='Blood Group'
                                    placeholder='Select your blood group'
                                    options={bloodGroups} />
                                <TextField
                                    {...register("height", {
                                        required: true
                                    })}
                                    required
                                    label='Height'
                                    placeholder='Enter your height' />
                                <TextField
                                    {...register("weight", {
                                        required: true
                                    })}
                                    required
                                    label='Weight'
                                    placeholder='Enter your weight' />
                                <Dropdown
                                    {...register("district", {
                                        required: true
                                    })}
                                    label='District'
                                    required
                                    placeholder='Select your district'
                                    options={getAllDistricts()}
                                    value={district}
                                    onChange={(districtVal) => {
                                        setDistrict(districtVal.target.value);


                                    }}
                                />
                                <Dropdown
                                    {...register("taluk", {
                                        required: true
                                    })}
                                    label='Taluk'
                                    required
                                    placeholder='Select your taluk'
                                    disabled={district === undefined}
                                    options={getTaluksByDistrict(district!)}
                                    value={taluk}
                                    onChange={(talukVal) => {
                                        setTaluk(talukVal.target.value);


                                    }}
                                />

                                <Dropdown
                                    {...register("village", {
                                        required: true
                                    })}
                                    required
                                    label='Village'
                                    placeholder='Select your village'
                                    disabled={taluk == undefined || district == undefined}
                                    options={taluk && district ? getVillagesByTaluk(district, taluk) : []}
                                />

                                <TextField
                                    {...register("parent", {
                                        required: true
                                    })}
                                    required
                                    label='Parent/Guardian Name'
                                    placeholder='Enter your parent/guardian name'
                                />

                                <TextField
                                    {...register("parentContact", {
                                        required: true
                                    })}
                                    required
                                    type='tel'
                                    label='Parent/Guardian Contact Number'
                                    placeholder='Enter your parent/guardian contact number'
                                />
                                <TextField
                                    {...register("permanentAddress", {
                                        required: true
                                    })}
                                    required
                                    isDescriptive
                                    label='Permanent Address'
                                    placeholder='Enter your permanent address'
                                />

                                <TextField
                                    {...register("pincode", {
                                        required: true
                                    })}
                                    required
                                    label='Pincode'
                                    placeholder='Enter your area pincode'
                                />



                            </div>
                        </div>
                        {/* {Upload Photo and Signature} */}
                        <div className='mt-16'>
                            <h2 className='text-4xl font-isans font-semibold text-primary-500'>Upload Photo and Signature</h2>
                            <p className='mt-2 text-md  text-gray-600'>Please upload your recent passport size photo and signature.</p>

                            <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                <ImagePreviewFileUpload
                                    {...register("photo")}
                                    onFilesChange={() => { }}
                                    accept='image/*,.jpg'
                                    multiple={false}
                                    label='Upload Photo'
                                    uploadText='Click to upload'
                                    supportedFormats='JPEG, PNG'
                                    maxSize='2MB'
                                    className=''
                                    uploadedFiles={[]}

                                />
                                <ImagePreviewFileUpload
                                    {...register("signature")}
                                    onFilesChange={() => { }}
                                    accept='image/*,.jpg'
                                    multiple={false}
                                    label='Upload Signature'
                                    uploadText='Click to upload'
                                    supportedFormats='JPEG, PNG'
                                    maxSize='2MB'
                                    className=''
                                    uploadedFiles={[]}

                                />

                            </div>
                        </div>
                        <Button
                            type='submit' className='mt-12 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg'>
                            Submit Registration
                        </Button>
                    </form>

                </div >
            </div >
        </div >
    )
}

export default VolunteerRegistrationPage
