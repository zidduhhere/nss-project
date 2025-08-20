import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LoginLeftSide() {
    const navigate = useNavigate();
    const { loginAs } = useAuth();

    return (
        <div className='flex items-center justify-center'>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    loginAs('student');
                    navigate('/dashboard/student');
                }}
                className='space-y-6 w-full max-w-md'
            >
                <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>KTU ID</label>
                    <input className='w-full border rounded-md px-3 py-2' name='identifier' />
                </div>
                <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>Password</label>
                    <input type='password' className='w-full border rounded-md px-3 py-2' name='password' />
                </div>
                <button type='submit' className='w-full rounded-md bg-nss-600 text-white py-2 font-medium'>Sign In</button>
            </form>
        </div>
    );
}
