import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function awaitUnitLoginLeftSide() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/dashboard/unit');
    };

    return (
        <div className="flex items-center justify-center w-full p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white/60 backdrop-blur rounded-2xl p-8 shadow">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-black font-isans">UNIT Sign In</h2>

                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg bg-white/80"
                        placeholder="unit@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg bg-white/80"
                        placeholder="••••••"
                    />
                </div>
                <button type="submit" className="w-full bg-nss-600 hover:bg-nss-700 text-white py-3 rounded-lg font-medium transition-colors">Sign In</button>
                <div className="text-center text-xs text-gray-500">Switch to student? <a href="/login" className="text-nss-600 hover:underline">Student Login</a></div>
            </form>
        </div>
    );
}
