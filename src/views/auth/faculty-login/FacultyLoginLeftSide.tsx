import LoginForm from '@/components/forms/LoginForm';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function FacultyLoginLeftSide() {
    const { loginFaculty } = useApp();
    const navigate = useNavigate();
    return (
        <div className='flex items-center justify-center'>
            <LoginForm
                roleMode='faculty'
                onLogin={async (credentials) => {
                    const success = await loginFaculty(credentials.identifier, credentials.password);
                    if (success) navigate('/dashboard/faculty');
                    return success;
                }}
                isLoading={false}
                error={null}
                hideRegisterLink
                secondaryLinkMode='student'
            />
        </div>
    );
}
