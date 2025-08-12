import React from 'react';
import { BookOpen } from 'lucide-react';
import { TextField, TextArea } from '@/components/ui';

interface StudentInfoProps {
    formData: {
        age: string;
        place: string;
        college: string;
        fatherName: string;
        address: string;
        ktuRegistrationNumber: string;
        unitNumber: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StudentInfo({ formData, onChange }: StudentInfoProps) {
    return (
        <div className="space-y-6 p-6 bg-gradient-to-r from-nss-50 to-nss-100 rounded-2xl border border-nss-100">
            <h3 className="text-xl font-bold text-nss-700 mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-2" />
                Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                    label="Age *"
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={onChange}
                    placeholder="Enter your age"
                    className="bg-white"
                    required
                />

                <TextField
                    label="Place *"
                    type="text"
                    id="place"
                    name="place"
                    value={formData.place}
                    onChange={onChange}
                    placeholder="Enter your place"
                    className="bg-white"
                    required
                />

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
                    label="Father's Name *"
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={onChange}
                    placeholder="Enter father's name"
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
                    label="Unit Number *"
                    type="text"
                    id="unitNumber"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={onChange}
                    placeholder="Enter unit number"
                    className="bg-white"
                    required
                />
            </div>

            <TextArea
                label="Address *"
                id="address"
                name="address"
                value={formData.address}
                onChange={onChange}
                rows={3}
                placeholder="Enter your complete address"
                className="bg-white"
                required
            />
        </div>
    );
}
