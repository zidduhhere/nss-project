import { BookOpen } from 'lucide-react';
import { TextField } from '../ui';
import { getAllDistricts } from '@/utils/data/taluks';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormFields } from '@/types/StudentFormSchema';
import { getCollege } from '@/utils/data/college';



interface StudentInfoProps {
    register: UseFormRegister<FormFields>;
    errors: FieldErrors<FormFields>;
}

export default function StudentInfo({ register, errors }: StudentInfoProps) {
    const colleges = getCollege();
    const districts = getAllDistricts();


    return (
        <div className="space-y-6 p-6 bg-gradient-to-r from-nss-50 to-nss-100 rounded-2xl border border-nss-100">
            <h3 className="text-xl font-bold text-nss-700 mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-2" />
                Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* District Dropdown with arrow */}
                <div className="flex flex-col space-y-2 relative">
                    <label htmlFor="district" className="text-sm font-medium">
                        District
                        <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <select
                            {...register("district")}
                            style={{ WebkitAppearance: 'none' }}
                            className="bg-white border border-gray-50 text-gray-900 text-sm rounded-lg focus:ring-nss-50 focus:border-nss-50 block w-full px-4 py-2 pr-10"
                        >
                            <option value="" disabled>Select your district</option>
                            {districts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}

                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* College Dropdown with arrow */}
                <div className="flex flex-col space-y-2 relative">
                    <label className="text-sm font-medium text-gray-700">
                        College
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            {...register("college")}

                            style={{ WebkitAppearance: 'none' }}
                            className="bg-white border border-gray-50 text-gray-900 text-sm rounded-lg focus:ring-nss-50 focus:border-nss-50 block w-full px-4 py-2 pr-10"
                        >
                            <option value="" disabled>Select your college</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.college_name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <TextField
                    {...register("ktuRollNumber")}
                    label="KTU Roll Number"
                    type="text"
                    placeholder="Enter KTU registration number"
                    error={errors.ktuRollNumber}
                    className="bg-white"

                />

                <TextField
                    {...register("email", {
                        required: "Email is required",
                    })}
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white"
                    error={errors.email}
                    required
                />
            </div>
        </div >
    );
}

