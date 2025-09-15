import Student from '@/models/student';
import RegisterForm from '../../../components/forms/RegisterForm';
import { UseStudentAuth } from '@/context/student/StudentAuthContext';
import { useState } from 'react';

export default function RegisterLeftSide() {

    const { signUpUser } = UseStudentAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (studentData: Student, password: string) => {
        setIsLoading(true);
        console.log('Registering student:', studentData);
        const { success, error } = await signUpUser(studentData, password);
        setIsLoading(false);
        if (success) {
            console.log('Registration successful');
            return true;
        }
        else {
            setError(error?.message || 'Registration failed');
            console.log('Registration failed');
            return false;
        }
    }

    return (
        <div className="flex items-center justify-center ">
            <div className="w-full bg-white/70 md:pt-0">
                <RegisterForm
                    onRegister={handleRegister}
                    isLoading={isLoading}
                    error={error}
                    onErrorClear={() => setError(null)}
                />
            </div>
        </div>
    );
}
