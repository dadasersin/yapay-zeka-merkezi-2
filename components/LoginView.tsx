
import React, { useState } from 'react';
import { loginWithEmail } from '../authService';

interface Props {
    onLoginSuccess: () => void;
}

const LoginView: React.FC<Props> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginWithEmail(email, password);
            onLoginSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Giriş başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>

            <div className="z-10 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <i className="fas fa-brain text-4xl text-cyan-400 mb-4"></i>
                    <h1 className="text-2xl font-bold text-white">Yapay Zeka Merkezi</h1>
                    <p className="text-gray-400 text-sm mt-2">Yönetici Girişi</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-xs uppercase font-bold ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs uppercase font-bold ml-1">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all disabled:opacity-50"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Giriş Yap'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Sadece <b>dadasersin@gmail.com</b> giriş yapabilir.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
