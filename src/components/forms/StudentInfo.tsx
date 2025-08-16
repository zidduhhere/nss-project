import React from 'react';
import { BookOpen } from 'lucide-react';
import { TextField } from '../ui';

interface StudentInfoProps {
    formData: {
        district: string;
        college: string;
        ktuRegistrationNumber: string;
        email?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function StudentInfo({ formData, onChange }: StudentInfoProps) {
    return (
        <div className="space-y-6 p-6 bg-gradient-to-r from-nss-50 to-nss-100 rounded-2xl border border-nss-100">
            <h3 className="text-xl font-bold text-nss-700 mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-2" />
                Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* District Dropdown (Kerala - 14 districts) */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="district" className="text-sm font-medium text-gray-700">
                        District *
                    </label>
                    <select
                        id="district"
                        name="district" /* keeping underlying field name 'district' for backward compatibility */
                        value={formData.district}
                        onChange={onChange}
                        required
                        className="bg-white border border-gray-50 text-gray-900 text-sm rounded-lg focus:ring-nss-50 focus:border-nss-50 block w-full px-4 py-2"
                    >
                        <option value="" disabled>Select your district</option>
                        <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                        <option value="Kollam">Kollam</option>
                        <option value="Pathanamthitta">Pathanamthitta</option>
                        <option value="Alappuzha">Alappuzha</option>
                        <option value="Kottayam">Kottayam</option>
                        <option value="Idukki">Idukki</option>
                        <option value="Ernakulam">Ernakulam</option>
                        <option value="Thrissur">Thrissur</option>
                        <option value="Palakkad">Palakkad</option>
                        <option value="Malappuram">Malappuram</option>
                        <option value="Kozhikode">Kozhikode</option>
                        <option value="Wayanad">Wayanad</option>
                        <option value="Kannur">Kannur</option>
                        <option value="Kasaragod">Kasaragod</option>
                    </select>
                </div>

                <TextField
                    label="College *"
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={onChange}
                    placeholder="Enter your college name"
                    className="bg-white"
                    required
                />

                <TextField
                    label="KTU Registration Number *"
                    type="text"
                    id="ktuRegistrationNumber"
                    name="ktuRegistrationNumber"
                    value={formData.ktuRegistrationNumber}
                    onChange={onChange}
                    placeholder="Enter KTU registration number"
                    className="bg-white"
                    required
                />

                <TextField
                    label="Email *"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={onChange}
                    placeholder="Enter your email address"
                    className="bg-white"
                    required
                />
            </div>

            {/* Removed address, age, father's name, unit number per new requirements */}


        </div>
    );
}
