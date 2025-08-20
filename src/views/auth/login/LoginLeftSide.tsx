import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TextField, Button } from '@/components/ui';
import { useState } from 'react';

export default function LoginLeftSide() {
    const navigate = useNavigate();
    const { loginAs } = useAuth();
    const [ktuId, setKtuId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // No validation / backend – instant demo login
        loginAs('student');
        navigate('/dashboard/student');
    };

    return (
        <div className="flex items-center justify-center w-full p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <div className="space-y-4">
                    <TextField
                        label="KTU ID / Email"
                        value={ktuId}
                        onChange={(e) => setKtuId(e.target.value)}
                        placeholder="Enter your KTU ID / email"
                        name="identifier"
                        type="text"
                    />
                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        name="password"
                        type="password"
                        showPasswordToggle
                        showPassword={false}
                    />
                </div>
                <Button type="submit" variant="primary" size="md">
                    Sign In
                </Button>
                <div className="text-center space-y-3 pt-2">
                    <div className="text-sm text-nss-600">
                        Need an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="font-bold  text-nss-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40"
                        >
                            Register
                        </button>
                    </div>
                    <div className="text-sm text-nss-500">
                        Are you faculty?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login/faculty')}
                            className="font-bold text-nss-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40"
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
