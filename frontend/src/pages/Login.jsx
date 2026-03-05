import { useState } from 'react';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        // Chama a rota de login que definimos no backend
        const response = await api.post('/auth/login', { email, senha });
        
        // Salva o token e os dados do usuário
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        onLoginSuccess();
        } catch (err) {
        setErro(err.response?.data?.error || 'Falha ao entrar');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sistema de Suporte</h2>
            
            {erro && <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{erro}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input 
                type="email" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@suporte.com"
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input 
                type="password" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition shadow-md"
            >
                Entrar no Sistema
            </button>
            </form>
        </div>
        </div>
    );
}